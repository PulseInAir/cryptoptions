import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PLAN_AMOUNT_PAISE: Record<string, number> = { pro: 69900 };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
    const KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    if (!KEY_ID || !KEY_SECRET) {
      return new Response(JSON.stringify({ error: 'Razorpay not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const plan = (body.plan as string) || 'pro';
    const amount = PLAN_AMOUNT_PAISE[plan];
    if (!amount) return new Response(JSON.stringify({ error: 'invalid plan' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const auth = btoa(`${KEY_ID}:${KEY_SECRET}`);
    const orderResp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount, currency: 'INR',
        receipt: `co_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: user.id, plan },
      }),
    });
    const order = await orderResp.json();
    if (!orderResp.ok) {
      console.error('Razorpay order error', order);
      return new Response(JSON.stringify({ error: order?.error?.description || 'order failed' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Use service role to insert payment row (bypasses RLS write policies)
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await admin.from('payments').insert({
      user_id: user.id, razorpay_order_id: order.id, amount, currency: 'INR', status: 'created', plan,
    });

    return new Response(JSON.stringify({ order_id: order.id, amount, currency: 'INR', key_id: KEY_ID }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const expected = createHmac('sha256', KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (expected !== razorpay_signature) {
      return new Response(JSON.stringify({ error: 'invalid signature' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Verify the order belongs to this user
    const { data: pay } = await admin.from('payments').select('user_id, plan').eq('razorpay_order_id', razorpay_order_id).maybeSingle();
    if (!pay || pay.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'order mismatch' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    await admin.from('payments').update({
      razorpay_payment_id, razorpay_signature, status: 'paid',
    }).eq('razorpay_order_id', razorpay_order_id);

    // Grant pro role (idempotent via unique constraint)
    await admin.from('user_roles').insert({ user_id: user.id, role: pay.plan === 'pro' ? 'pro' : 'pro' }).select();

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

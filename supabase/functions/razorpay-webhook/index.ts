import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac, timingSafeEqual } from "node:crypto";

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });
  try {
    const SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
    const sig = req.headers.get('x-razorpay-signature') ?? '';
    const raw = await req.text();
    const expected = createHmac('sha256', SECRET).update(raw).digest('hex');
    const a = Buffer.from(expected, 'hex'); const b = Buffer.from(sig, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return new Response('invalid signature', { status: 400 });
    }
    const event = JSON.parse(raw);
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment?.entity;
      const orderId = payment?.order_id;
      if (orderId) {
        const { data: pay } = await admin.from('payments').select('user_id, plan, status').eq('razorpay_order_id', orderId).maybeSingle();
        if (pay && pay.status !== 'paid') {
          await admin.from('payments').update({ razorpay_payment_id: payment.id, status: 'paid' }).eq('razorpay_order_id', orderId);
          await admin.from('user_roles').insert({ user_id: pay.user_id, role: 'pro' });
        }
      }
    }
    return new Response('ok', { status: 200 });
  } catch (e) {
    console.error('webhook error', e);
    return new Response('error', { status: 500 });
  }
});

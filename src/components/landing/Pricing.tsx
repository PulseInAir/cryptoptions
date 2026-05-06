import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Pricing() {
  const { user, plan, refreshPlan } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const handleUpgrade = async () => {
    if (!user) { nav('/auth'); return; }
    if (plan === 'pro' || plan === 'admin') return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', { body: { plan: 'pro' } });
      if (error || !data?.order_id) { toast.error(error?.message || 'Could not start checkout'); return; }
      const rk = data.key_id;
      // Load Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) return resolve();
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(); s.onerror = () => reject(new Error('script'));
        document.body.appendChild(s);
      });
      const rzp = new (window as any).Razorpay({
        key: rk,
        order_id: data.order_id,
        amount: data.amount,
        currency: data.currency,
        name: 'CryptOptions',
        description: 'Pro plan — monthly',
        prefill: { email: user.email },
        theme: { color: '#6366f1' },
        handler: async (resp: any) => {
          const v = await supabase.functions.invoke('razorpay-verify-payment', { body: resp });
          if (v.error) toast.error('Verification failed'); else { toast.success('Welcome to Pro!'); await refreshPlan(); }
        },
        modal: { ondismiss: () => toast.message('Checkout closed') },
      });
      rzp.open();
    } catch (e: any) { toast.error(e?.message || 'Checkout error'); }
    finally { setBusy(false); }
  };
  const free = ["Basic BTC/ETH option chains", "Live spot prices", "5 paper trades / day", "Basic OI charts", "Community support"];
  const pro = ["Everything in Free", "Unlimited paper trades", "Full strategy builder + Greeks", "OI heatmaps & max-pain", "Whale flow sentiment", "Multi-expiry analytics", "Priority support"];
  return (
    <section className="container py-20" id="pricing">
      <div className="text-center mb-14">
        <h2 className="text-4xl lg:text-5xl font-bold">Simple pricing.</h2>
        <p className="mt-4 text-muted-foreground text-lg">Start free. Upgrade when you're hooked.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Plan name="Free" price="₹0" period="forever" features={free} cta="Get Started" onClick={() => !user && nav('/auth')} />
        <Plan name="Pro" price="₹699" period="/month" features={pro} cta={plan === 'pro' || plan === 'admin' ? "You're on Pro" : (busy ? 'Loading…' : 'Upgrade to Pro')} highlight onClick={handleUpgrade} disabled={plan === 'pro' || plan === 'admin' || busy} />
      </div>
    </section>
  );
}

function Plan({ name, price, period, features, cta, highlight, onClick, disabled }: { name: string; price: string; period: string; features: string[]; cta: string; highlight?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <div className={`relative rounded-2xl p-8 shadow-card ${highlight ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'bg-card border border-border'}`}>
      {highlight && <div className="absolute -top-3 left-8 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
      <div className="text-sm font-semibold opacity-80 uppercase tracking-wider">{name}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-5xl font-bold">{price}</span>
        <span className={highlight ? 'opacity-80' : 'text-muted-foreground'}>{period}</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`h-5 w-5 shrink-0 ${highlight ? '' : 'text-primary'}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button onClick={onClick} disabled={disabled} className={`mt-8 w-full h-12 ${highlight ? 'bg-background text-foreground hover:bg-background/90' : 'bg-gradient-primary text-primary-foreground'}`}>
        {cta}
      </Button>
    </div>
  );
}

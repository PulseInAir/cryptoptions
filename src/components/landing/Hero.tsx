import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";

export function Hero() {
  const [open, setOpen] = useState(false);
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="container relative py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Delta Exchange India
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Trade <span className="text-gradient">Crypto Options</span><br />like a Pro.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              India's largest BTC & ETH options paper-trading platform. Live option chains, strategy builder with Greeks, OI analytics — all in one place. Practice risk-free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-12 px-6" onClick={() => setOpen(true)}>
                Start Paper Trading <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/option-chain">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  <Play className="mr-2 h-4 w-4" /> View Live Chain
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="1.2M+" l="Trades simulated" />
              <Stat n="50K+" l="Active traders" />
              <Stat n="24/7" l="Live data" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-full animate-float" />
            <div className="relative glass rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">BTC Iron Condor · Weekly</div>
                  <div className="text-2xl font-bold">P&L Payoff</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Max Profit</div>
                  <div className="text-bull font-semibold">+₹18,450</div>
                </div>
              </div>
              <MiniPayoff />
              <div className="grid grid-cols-4 gap-3 mt-4 text-xs">
                {['Δ -0.02', 'Γ 0.001', 'Θ +124', 'V -8.2'].map(g => (
                  <div key={g} className="rounded-lg bg-secondary/60 px-3 py-2 text-center font-mono">{g}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return <div><div className="text-2xl font-bold text-gradient">{n}</div><div className="text-xs text-muted-foreground">{l}</div></div>;
}

function MiniPayoff() {
  // simple iron-condor SVG sketch
  const pts = [[0,40],[80,40],[120,10],[180,10],[220,40],[300,40]];
  const path = pts.map((p,i) => `${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <svg viewBox="0 0 300 80" className="w-full h-32">
      <line x1="0" y1="40" x2="300" y2="40" stroke="hsl(var(--border))" strokeDasharray="2 4" />
      <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
      <path d={`${path} L 300 80 L 0 80 Z`} fill="hsl(var(--primary)/0.15)" />
    </svg>
  );
}

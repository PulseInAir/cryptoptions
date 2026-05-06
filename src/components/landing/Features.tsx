import { LineChart, Layers, Activity, Waves, Briefcase, Brain } from "lucide-react";

const features = [
  { icon: Layers, title: "Strategy Builder", desc: "Long calls, straddles, iron condors — drag-drop legs, see Greeks & payoff instantly.", color: "from-violet-500 to-fuchsia-500" },
  { icon: LineChart, title: "BTC/ETH Option Chain", desc: "Live strikes, bids/asks, IV, volume & OI streamed from Delta Exchange India.", color: "from-cyan-500 to-blue-500" },
  { icon: Activity, title: "Paper Trading Sim", desc: "₹10L virtual capital. Realistic slippage. Forward-test any strategy with zero risk.", color: "from-emerald-500 to-teal-500" },
  { icon: Waves, title: "Crypto OI Analysis", desc: "Multi-strike OI heatmaps, max-pain calc, put/call ratio across expiries.", color: "from-amber-500 to-orange-500" },
  { icon: Brain, title: "Whale Flow Sentiment", desc: "On-chain sentiment + simulated whale flows to spot smart-money positioning.", color: "from-pink-500 to-rose-500" },
  { icon: Briefcase, title: "Positions Analyzer", desc: "Live MTM, portfolio Greeks, scenario analysis on your simulated book.", color: "from-indigo-500 to-purple-500" },
];

export function Features() {
  return (
    <section className="container py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Everything you need</div>
        <h2 className="text-4xl lg:text-5xl font-bold">Pro tools, zero risk.</h2>
        <p className="mt-4 text-muted-foreground text-lg">Sensibull-grade analytics, reimagined for BTC & ETH options on Delta Exchange India.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(f => (
          <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-glow transition-all hover:-translate-y-1">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-lg`}>
              <f.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

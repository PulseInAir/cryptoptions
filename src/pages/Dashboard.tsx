import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { TrendingUp, Wand2, Hammer, BookOpen, Flame, Hash, Brain, BarChart3, Activity, Layers, LineChart, Database, Search, Sparkles, Calendar } from "lucide-react";
import { ReactNode } from "react";

const traders = [
  { n: "Trading Lens", h: "@TheTradingLens", v: "₹25.28L", c: "+15%" },
  { n: "Joydeep Ghosh", h: "@joydeep_cmc", v: "₹12.4L", c: "+8%" },
  { n: "Sachin Goyal", h: "@_sachin_goyal", v: "₹8.71L", c: "+33%" },
  { n: "TraderKutta", h: "@TraderKutta", v: "₹6.7L", c: "+5%" },
];

const primary = [
  { icon: Wand2, title: "Easiest way to trade options", desc: "Just guess up or down, and get Option Strategies.", cta: "Easy options", to: "/strategy-builder" },
  { icon: BookOpen, title: "Get ready-made strategies", desc: "Predict BTC or ETH and get the best Option Strategies.", cta: "Strategy wizard", to: "/strategy-builder" },
  { icon: Hammer, title: "Create your own strategies", desc: "Create and analyse your own custom Options Strategies.", cta: "Strategy builder", to: "/strategy-builder" },
  { icon: TrendingUp, title: "Practice Trade / Draft Portfolios", desc: "Create and track your trades risk-free.", cta: "Practice Trade", to: "/paper-trading" },
  { icon: Flame, title: "BTC/ETH Heatmap", desc: "Discover crypto market trends at a glance.", cta: "Heatmap", to: "/oi-analysis" },
  { icon: Hash, title: "#VerifiedByCryptOptions", desc: "Share your verified P&L with the trading community.", cta: "Share P&L", to: "/positions" },
];

const direction = [
  { icon: BarChart3, title: "Option chain", desc: "All options data in one place. Identify supports and resistances.", to: "/option-chain" },
  { icon: Activity, title: "Open interest analysis", desc: "Get clues on the direction with intraday changes in open interest.", to: "/oi-analysis" },
];
const oi = [
  { icon: Layers, title: "Multi-strike OI", desc: "Graph of OI buildup in each strike. See the battle between calls and puts.", to: "/oi-analysis" },
  { icon: Database, title: "Whale Flow data", desc: "Know what the big wallets are doing with on-chain Buy/Sell data.", to: "/oi-analysis" },
];
const charts = [
  { icon: LineChart, title: "Multi Straddle-Strangle Charts", desc: "Track price curves of multiple straddles, strangles and custom options strategies in a single chart.", to: "/strategy-builder" },
  { icon: Activity, title: "Live Options Charts", desc: "Predict market direction with the power of real-time options data charts.", to: "/option-chain" },
];
const data = [
  { icon: Database, title: "Crypto data", desc: "All key derivatives data of BTC and ETH summarized in one page.", to: "/option-chain" },
];
const trades = [
  { icon: Search, title: "Screener", desc: "Find great trading opportunities with the screener.", to: "/option-chain" },
  { icon: Sparkles, title: "Technical signals", desc: "A simple place to see candlestick patterns and moving average crossovers.", to: "/oi-analysis" },
];
const others = [
  { icon: LineChart, title: "IV chart", desc: "Implied Volatility charts of BTC and ETH options.", to: "/oi-analysis" },
  { icon: Calendar, title: "Events calendar", desc: "Find big trading opportunities with the crypto events calendar.", to: "#" },
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const name = profile?.display_name || user?.email?.split('@')[0] || 'Trader';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-10 space-y-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold">Welcome {name},</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-bull animate-pulse mr-2" />
            <span className="font-bold text-foreground">5,581 traders</span> are sharing their live positions right now.
            <Link to="/positions" className="text-primary ml-2 hover:underline">Check out Showcase →</Link>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {traders.map(t => (
            <div key={t.h} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{t.n.split(' ').map(s=>s[0]).join('')}</div>
                <div className="min-w-0">
                  <div className="text-xs text-bull font-semibold">● Live</div>
                  <div className="text-sm font-semibold truncate">{t.n}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{t.h}</div>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-xl font-bold text-bull">{t.v}</div>
                <div className="text-xs text-bull">{t.c}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {primary.map(p => (
                <Link key={p.title} to={p.to} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-glow transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center"><p.icon className="h-4 w-4 text-primary-foreground" /></div>
                    <span className="text-sm font-semibold">{p.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{p.desc}</p>
                  <div className="rounded-md bg-secondary/60 py-2 text-center text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{p.cta}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-glow flex flex-col">
            <Brain className="h-10 w-10 mb-3" />
            <div className="text-xl font-bold">Introducing Mindful Trading</div>
            <p className="mt-2 text-sm opacity-90 flex-1">Breathe, then trade. A simple pause to help you trade more intentionally.</p>
            <button className="mt-4 rounded-md bg-background text-foreground py-2 text-sm font-semibold hover:bg-background/90">Try Now</button>
          </div>
        </div>

        <Block title="Advanced tools" sub="Tools to guess the direction" items={direction} />
        <Block items={oi} />
        <Block items={charts} />
        <Block items={data} />
        <Block title="Find great trades" items={trades} />
        <Block title="Others" items={others} />
      </main>
      <Footer />
    </div>
  );
}

function Block({ title, sub, items }: { title?: string; sub?: string; items: { icon: any; title: string; desc: string; to: string }[] }) {
  return (
    <section className="space-y-3">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(i => (
          <Link key={i.title} to={i.to} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-all flex gap-4">
            <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-primary flex items-center justify-center"><i.icon className="h-6 w-6 text-primary-foreground" /></div>
            <div>
              <div className="font-semibold mb-1">{i.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{i.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
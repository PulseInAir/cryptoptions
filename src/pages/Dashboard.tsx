import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToolThumb } from "@/components/dashboard/ToolThumb";
import { TrendingUp, Wand2, Hammer, BookOpen, Flame, Hash, ArrowRight, type LucideIcon } from "lucide-react";

type Primary = { icon: LucideIcon; title: string; desc: string; cta: string; to: string; tone: string };
const primary: Primary[] = [
  { icon: TrendingUp, title: "Easiest way to trade options", desc: "Just guess up or down, and get Option Strategies.", cta: "Easy options", to: "/strategy-builder", tone: "bg-bull/10 text-bull" },
  { icon: Wand2, title: "Get ready-made strategies", desc: "Predict BTC or ETH and get the best Option Strategies.", cta: "Strategy wizard", to: "/strategy-builder", tone: "bg-primary/10 text-primary" },
  { icon: Hammer, title: "Create your own strategies", desc: "Create and analyse your own custom Options Strategies.", cta: "Strategy builder", to: "/strategy-builder", tone: "bg-accent/10 text-accent" },
  { icon: BookOpen, title: "Practice Trade / Draft Portfolios", desc: "Create and track your trades risk-free.", cta: "Practice Trade / Draft Portfolios", to: "/paper-trading", tone: "bg-primary/10 text-primary" },
  { icon: Flame, title: "BTC/ETH Heatmap", desc: "Discover crypto market trends at a glance.", cta: "Heatmap", to: "/oi-analysis", tone: "bg-bear/10 text-bear" },
  { icon: Hash, title: "#VerifiedByCryptOptions", desc: "Share your verified P&L with the trading community.", cta: "Share Verified P&L", to: "/positions", tone: "bg-accent/10 text-accent" },
];

type ToolKind = React.ComponentProps<typeof ToolThumb>["kind"];
type Tool = { kind: ToolKind; title: string; desc: string; to: string };

const direction: Tool[] = [
  { kind: "option-chain", title: "Option chain", desc: "All options data in one place. Identify supports and resistances.", to: "/option-chain" },
  { kind: "oi-bars", title: "Open interest analysis", desc: "Get clues on the direction with intraday changes in open interest.", to: "/oi-analysis" },
  { kind: "multi-strike", title: "Multi strike OI", desc: "Graph of OI buildup in each strike. See the battle between calls and puts.", to: "/oi-analysis" },
  { kind: "whale", title: "Whale Flow data", desc: "Know what the big wallets are doing with on-chain Buy/Sell data.", to: "/oi-analysis" },
  { kind: "straddle", title: "Multi Straddle-Strangle Charts", desc: "Track price curves of multiple straddles, strangles and custom options strategies in a single chart.", to: "/strategy-builder" },
  { kind: "live-chart", title: "Live Options Charts", desc: "Predict market direction with the power of real-time options data charts.", to: "/option-chain" },
  { kind: "crypto-data", title: "Crypto data", desc: "All key derivatives data of BTC and ETH summarized in one page.", to: "/option-chain" },
];

const findTrades: Tool[] = [
  { kind: "screener", title: "Screener", desc: "Find great trading opportunities with the screener.", to: "/option-chain" },
  { kind: "signals", title: "Technical signals", desc: "A simple place to see candlestick patterns and moving average crossovers.", to: "/oi-analysis" },
];

const others: Tool[] = [
  { kind: "iv", title: "IV chart", desc: "Implied Volatility charts of BTC and ETH options.", to: "/oi-analysis" },
  { kind: "events", title: "Events calendar", desc: "Find big trading opportunities with the crypto events calendar.", to: "#" },
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const name = profile?.display_name || user?.email?.split("@")[0];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 container max-w-6xl py-8 lg:py-10 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Welcome to <span className="text-gradient">CryptOptions</span>
              {name && <span className="text-muted-foreground font-normal text-xl lg:text-2xl">, {name}</span>}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">India's first crypto option trading terminal</p>
          </div>
          <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
            <Link to="/pricing">Connect with broker</Link>
          </Button>
        </header>

        <section className="rounded-2xl border border-border bg-card shadow-card p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
            {primary.map((p) => (
              <PrimaryTile key={p.title} {...p} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-7 space-y-8">
          <h2 className="text-xl font-bold">Advanced tools</h2>

          <ToolGroup label="Tools to guess the direction" tools={direction} />
          <ToolGroup label="Find great trades" tools={findTrades} />
          <ToolGroup label="Others" tools={others} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PrimaryTile({ icon: Icon, title, desc, cta, to, tone }: Primary) {
  return (
    <div className="bg-card p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-2">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold leading-tight pt-1.5">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground flex-1 mb-4">{desc}</p>
      <Button asChild variant="outline" className="w-full justify-center">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}

function ToolGroup({ label, tools }: { label: string; tools: Tool[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((t) => (
          <Link
            key={t.title}
            to={t.to}
            className="group flex gap-4 rounded-xl border border-border bg-card p-3 hover:border-primary/50 hover:shadow-glow transition-all"
          >
            <ToolThumb kind={t.kind} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {t.title}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
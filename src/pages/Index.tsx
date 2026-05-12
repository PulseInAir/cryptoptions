import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Ticker } from "@/components/landing/Ticker";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { ShowcaseStrip } from "@/components/landing/ShowcaseStrip";
import { BrokerStrip } from "@/components/landing/BrokerStrip";
import { BigQuote } from "@/components/landing/BigQuote";
import { FeatureSplit } from "@/components/landing/FeatureSplit";
import { PayoffMock, PositionsMock, HeatmapMock, PaperMock, DashboardMock } from "@/components/landing/MockVisuals";
import { MindfulCard } from "@/components/landing/MindfulCard";
import { AccessAnywhere } from "@/components/landing/AccessAnywhere";
import { PressStrip } from "@/components/landing/PressStrip";

const Index = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && user) nav('/dashboard', { replace: true });
  }, [user, loading, nav]);
  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Hero />
      <Ticker />
      <ShowcaseStrip />
      <BrokerStrip />
      <BigQuote />
      <Features />
      <FeatureSplit
        eyebrow="Strategy Builder"
        title="Build Strategies without Spreadsheets."
        desc="Drag legs, see Greeks and payoff instantly. From long calls to iron condors — all in a few clicks."
        cta={{ label: "Try Strategy Builder", to: "/strategy-builder" }}
        visual={<PayoffMock />}
      />
      <FeatureSplit
        eyebrow="Positions Analyzer"
        title="Analyse & Manage your Trades."
        desc="Live MTM, portfolio Greeks and scenario analysis on every position in your simulated book."
        cta={{ label: "View Positions", to: "/positions" }}
        visual={<PositionsMock />}
        reverse
      />
      <FeatureSplit
        eyebrow="Paper Trading"
        title="Rehearse Before You Risk."
        desc="₹10,00,000 in virtual capital. Realistic slippage. Forward-test any strategy on real BTC/ETH option data, with zero downside."
        cta={{ label: "Start Paper Trading", to: "/paper-trading" }}
        visual={<PaperMock />}
      />
      <FeatureSplit
        eyebrow="OI Analysis"
        title="Track live market data and clarify trends."
        desc="Multi-strike OI heatmaps, max-pain calc, put/call ratios across BTC and ETH expiries — streamed from Delta Exchange India."
        cta={{ label: "Open OI Analysis", to: "/oi-analysis" }}
        visual={<HeatmapMock />}
        reverse
      />
      <FeatureSplit
        eyebrow="Whale Flow Sentiment"
        title="The pioneers of transparency in crypto F&O."
        desc="On-chain whale flow, sentiment shifts and smart-money positioning — surfaced before the candles catch up."
        cta={{ label: "Explore", to: "/oi-analysis" }}
        visual={<DashboardMock />}
      />
      <MindfulCard />
      <AccessAnywhere />
      <Testimonials />
      <PressStrip />
      <Pricing />
      <CTA />
    </main>
    <Footer />
  </div>
  );
};

export default Index;

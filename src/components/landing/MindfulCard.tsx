import { Brain } from "lucide-react";

export function MindfulCard() {
  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl lg:text-5xl font-bold">Conquer your Mind</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">Two questions before every trade. Built into the platform to keep you intentional.</p>
      </div>
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs text-muted-foreground mb-1">Have you journaled the thought behind this trade?</div>
          <div className="text-sm font-semibold text-primary">Yes / No</div>
        </div>
        <div className="hidden lg:flex h-32 w-32 mx-auto items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Brain className="h-14 w-14 text-primary-foreground" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs text-muted-foreground mb-1">Do you have a defined exit on this trade?</div>
          <div className="text-sm font-semibold text-primary">Yes / No</div>
        </div>
      </div>
    </section>
  );
}
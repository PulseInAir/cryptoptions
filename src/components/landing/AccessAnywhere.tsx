import { Smartphone, Globe } from "lucide-react";

export function AccessAnywhere() {
  return (
    <section className="container py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold">Access Anything,<br />Anywhere.</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-md">Trade and analyse from your desk or your phone. Same data, same speed, same dark mode.</p>
          <div className="mt-6 flex gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3"><Globe className="h-5 w-5 text-primary" /><span className="text-sm font-medium">Web App</span></div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3"><Smartphone className="h-5 w-5 text-primary" /><span className="text-sm font-medium">PWA</span></div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-64 h-[500px] rounded-[2.5rem] border-8 border-border bg-card shadow-glow overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-border rounded-b-2xl" />
            <div className="p-4 pt-8 space-y-3">
              <div className="rounded-lg bg-gradient-primary p-3 text-primary-foreground">
                <div className="text-[10px] opacity-80">BTC/USD</div>
                <div className="text-2xl font-bold">$96,420</div>
                <div className="text-xs">+2.34%</div>
              </div>
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-lg bg-secondary/60 p-2 flex justify-between">
                  <div className="text-xs font-mono">BTC {95000 + i * 1000} CE</div>
                  <div className="text-xs font-mono text-bull">+{(i * 0.7).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
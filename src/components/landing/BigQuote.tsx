export function BigQuote() {
  return (
    <section className="container py-16">
      <div className="max-w-4xl mx-auto rounded-3xl bg-card border border-border p-10 lg:p-14 shadow-card">
        <div className="text-6xl text-primary/30 leading-none mb-2">"</div>
        <p className="text-2xl lg:text-3xl font-medium leading-relaxed">
          CryptOptions turned my crypto options trading from chaotic gut-feel into a structured, data-driven process. The Greeks, the OI heatmaps, the paper trading — it's all I need.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">AS</div>
          <div>
            <div className="font-semibold">Aarav Sharma</div>
            <div className="text-sm text-muted-foreground">Full-time crypto options trader</div>
          </div>
        </div>
      </div>
    </section>
  );
}
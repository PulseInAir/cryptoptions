export function BrokerStrip() {
  const brokers = ["Delta Exchange India", "CoinDCX (soon)", "WazirX (soon)", "Binance (soon)"];
  return (
    <section className="container py-12">
      <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Integrated with leading exchanges</p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {brokers.map(b => (
          <div key={b} className="text-lg font-semibold text-muted-foreground/80 hover:text-foreground transition-colors">{b}</div>
        ))}
      </div>
    </section>
  );
}
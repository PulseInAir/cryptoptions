export function PressStrip() {
  const press = ["YourStory", "Inc42", "ET Now", "Moneycontrol", "CoinDesk"];
  return (
    <section className="container py-12">
      <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">In the spotlight</p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
        {press.map(p => (
          <div key={p} className="text-xl font-bold text-muted-foreground">{p}</div>
        ))}
      </div>
    </section>
  );
}
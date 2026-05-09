export function ShowcaseStrip() {
  const items = [
    { v: "50K+", l: "Active traders" },
    { v: "Delta", l: "Exchange India" },
    { v: "4.8★", l: "User rating" },
  ];
  return (
    <section className="container py-10">
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto rounded-2xl border border-border bg-card/60 p-6 text-center">
        {items.map(i => (
          <div key={i.l}>
            <div className="text-2xl lg:text-3xl font-bold text-gradient">{i.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
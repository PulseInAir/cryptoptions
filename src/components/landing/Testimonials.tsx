const t = [
  { n: "Aarav S.", r: "Full-time crypto trader", q: "Finally an Indian platform that treats crypto options seriously. The strategy builder saved me weeks of spreadsheets." },
  { n: "Priya M.", r: "Quant @ Mumbai", q: "OI heatmaps are insanely useful. I forward-test every weekly setup here before going live on Delta." },
  { n: "Rohan K.", r: "Options newbie", q: "Started with paper trades, learned the Greeks visually. Now I actually understand what theta does." },
  { n: "Sneha P.", r: "Discord community lead", q: "We share strategy links every Friday. The shareable payoff charts are 🔥." },
];
export function Testimonials() {
  return (
    <section className="container py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl lg:text-5xl font-bold">Loved by 50,000+ traders</h2>
        <p className="mt-4 text-muted-foreground text-lg">From first-time learners to full-time pros.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {t.map(x => (
          <div key={x.n} className="rounded-2xl glass p-6 shadow-card">
            <div className="text-accent text-xl mb-3">★★★★★</div>
            <p className="text-sm leading-relaxed mb-4">"{x.q}"</p>
            <div>
              <div className="font-semibold text-sm">{x.n}</div>
              <div className="text-xs text-muted-foreground">{x.r}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PayoffMock() {
  const pts = [[0,50],[80,50],[130,15],[200,15],[260,50],[320,50]];
  const path = pts.map((p,i) => `${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs text-muted-foreground">BTC · Iron Condor · Weekly</div>
        <div className="text-xs text-bull font-semibold">Max +₹18,450</div>
      </div>
      <svg viewBox="0 0 320 100" className="w-full h-40">
        <line x1="0" y1="50" x2="320" y2="50" stroke="hsl(var(--border))" strokeDasharray="2 4" />
        <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
        <path d={`${path} L 320 100 L 0 100 Z`} fill="hsl(var(--primary)/0.15)" />
      </svg>
      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
        {['Δ -0.02', 'Γ 0.001', 'Θ +124', 'V -8.2'].map(g => (
          <div key={g} className="rounded-lg bg-secondary/60 px-2 py-2 text-center font-mono">{g}</div>
        ))}
      </div>
    </div>
  );
}

export function PositionsMock() {
  const rows = [
    { s: 'BTC 95000 CE', q: '+1', p: '₹4,820', pl: '+₹612', up: true },
    { s: 'BTC 90000 PE', q: '-1', p: '₹3,150', pl: '-₹240', up: false },
    { s: 'ETH 3200 CE', q: '+2', p: '₹890', pl: '+₹128', up: true },
    { s: 'ETH 3000 PE', q: '-2', p: '₹540', pl: '+₹84', up: true },
  ];
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">Your positions</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border">
            <th className="text-left py-2">Instrument</th><th>Qty</th><th>Price</th><th className="text-right">P&L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.s} className="border-b border-border/50">
              <td className="py-2 font-mono text-xs">{r.s}</td>
              <td className="text-center font-mono text-xs">{r.q}</td>
              <td className="text-center font-mono text-xs">{r.p}</td>
              <td className={`text-right font-mono text-xs ${r.up ? 'text-bull' : 'text-bear'}`}>{r.pl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HeatmapMock() {
  const data = Array.from({ length: 8 * 6 }, (_, i) => ({ i, v: Math.random() }));
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">BTC · Multi-strike OI heatmap</div>
      <div className="grid grid-cols-8 gap-1">
        {data.map(d => (
          <div key={d.i} className="aspect-square rounded" style={{ background: `hsl(var(--primary) / ${0.15 + d.v * 0.7})` }} />
        ))}
      </div>
    </div>
  );
}

export function PaperMock() {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs text-muted-foreground">Paper Trading · Live</div>
        <div className="text-xs font-mono text-bull">+₹42,810 today</div>
      </div>
      <div className="space-y-2">
        {[60, 80, 45, 90, 70].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground w-12 font-mono">D-{5 - i}</div>
            <div className="flex-1 h-3 rounded bg-secondary/60 overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardMock() {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">Whale flow · Last 24h</div>
      <svg viewBox="0 0 320 100" className="w-full h-32">
        <path d="M0 70 Q 60 30 120 50 T 240 40 T 320 30" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
        <path d="M0 80 Q 60 60 120 70 T 240 55 T 320 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
      </svg>
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        {['BTC Bullish', 'ETH Neutral', 'PCR 0.84'].map(t => (
          <div key={t} className="rounded bg-secondary/60 py-1.5 text-center font-mono text-[10px]">{t}</div>
        ))}
      </div>
    </div>
  );
}
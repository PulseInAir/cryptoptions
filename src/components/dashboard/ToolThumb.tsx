type Kind =
  | "option-chain"
  | "oi-bars"
  | "multi-strike"
  | "whale"
  | "straddle"
  | "live-chart"
  | "crypto-data"
  | "screener"
  | "signals"
  | "iv"
  | "events";

export function ToolThumb({ kind }: { kind: Kind }) {
  return (
    <div className="h-20 w-28 shrink-0 rounded-lg border border-border bg-secondary/40 p-2 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 100 60" className="w-full h-full">{shape(kind)}</svg>
    </div>
  );
}

function shape(k: Kind) {
  switch (k) {
    case "option-chain":
      return (
        <g>
          {[10, 22, 34, 46].map((y, i) => (
            <g key={i}>
              <rect x="4" y={y} width="40" height="10" rx="2" fill="hsl(var(--bull) / 0.18)" />
              <rect x="56" y={y} width="40" height="10" rx="2" fill="hsl(var(--bear) / 0.18)" />
              <rect x="46" y={y} width="8" height="10" fill="hsl(var(--muted))" />
            </g>
          ))}
        </g>
      );
    case "oi-bars":
      return (
        <g>
          {[18, 28, 40, 22, 34, 46, 30, 20].map((h, i) => (
            <g key={i}>
              <rect x={6 + i * 11} y={50 - h} width="4" height={h} fill="hsl(var(--bull))" />
              <rect x={11 + i * 11} y={50 - h * 0.7} width="4" height={h * 0.7} fill="hsl(var(--bear))" />
            </g>
          ))}
        </g>
      );
    case "multi-strike":
      return (
        <g fill="none" strokeWidth="2">
          <path d="M2 40 L20 30 L38 35 L56 18 L74 24 L98 12" stroke="hsl(var(--primary))" />
          <path d="M2 50 L20 44 L38 40 L56 46 L74 38 L98 42" stroke="hsl(var(--accent))" />
        </g>
      );
    case "whale":
      return (
        <g>
          {[14, 28, 42, 56, 70, 84].map((x, i) => (
            <rect
              key={i}
              x={x}
              y={i % 2 ? 30 : 10}
              width="10"
              height={i % 2 ? 20 : 40}
              rx="2"
              fill={i % 2 ? "hsl(var(--bear))" : "hsl(var(--bull))"}
            />
          ))}
        </g>
      );
    case "straddle":
      return (
        <g fill="none" strokeWidth="2">
          <path d="M2 50 Q 25 10 50 30 T 98 20" stroke="hsl(var(--primary))" />
          <path d="M2 30 Q 25 50 50 38 T 98 48" stroke="hsl(var(--accent))" />
        </g>
      );
    case "live-chart":
      return (
        <g>
          {[20, 35, 25, 40, 30, 45, 38, 28, 42].map((h, i) => {
            const up = i % 2 === 0;
            return (
              <rect
                key={i}
                x={6 + i * 10}
                y={30 - h / 2}
                width="6"
                height={h}
                fill={up ? "hsl(var(--bull))" : "hsl(var(--bear))"}
              />
            );
          })}
        </g>
      );
    case "crypto-data":
      return (
        <g>
          <text x="50" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--primary))">
            BTC
          </text>
          <text x="50" y="44" textAnchor="middle" fontSize="14" fontWeight="700" fill="hsl(var(--accent))">
            ETH
          </text>
        </g>
      );
    case "screener":
      return (
        <g>
          <circle cx="28" cy="30" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
          <line x1="40" y1="42" x2="58" y2="56" stroke="hsl(var(--primary))" strokeWidth="3" />
          <rect x="60" y="14" width="34" height="6" rx="2" fill="hsl(var(--muted))" />
          <rect x="60" y="26" width="24" height="6" rx="2" fill="hsl(var(--muted))" />
        </g>
      );
    case "signals":
      return (
        <g>
          <line x1="20" y1="10" x2="20" y2="50" stroke="hsl(var(--bull))" strokeWidth="2" />
          <rect x="16" y="18" width="8" height="20" fill="hsl(var(--bull))" />
          <line x1="50" y1="6" x2="50" y2="54" stroke="hsl(var(--bear))" strokeWidth="2" />
          <rect x="46" y="14" width="8" height="28" fill="hsl(var(--bear))" />
          <line x1="80" y1="14" x2="80" y2="46" stroke="hsl(var(--bull))" strokeWidth="2" />
          <rect x="76" y="22" width="8" height="16" fill="hsl(var(--bull))" />
        </g>
      );
    case "iv":
      return (
        <g fill="none" strokeWidth="2">
          <path d="M2 50 Q 25 10 50 22 T 98 14" stroke="hsl(var(--primary))" />
          <path d="M2 50 Q 25 30 50 38 T 98 30" stroke="hsl(var(--accent))" strokeDasharray="3 3" />
        </g>
      );
    case "events":
      return (
        <g>
          <rect x="14" y="8" width="72" height="48" rx="4" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="14" y1="20" x2="86" y2="20" stroke="hsl(var(--primary))" strokeWidth="2" />
          {[24, 44, 64].map((x, i) => (
            <rect key={i} x={x} y={28} width="14" height="10" rx="1" fill="hsl(var(--muted))" />
          ))}
          {[24, 44, 64].map((x, i) => (
            <rect key={i} x={x} y={42} width="14" height="10" rx="1" fill="hsl(var(--muted))" />
          ))}
        </g>
      );
  }
}
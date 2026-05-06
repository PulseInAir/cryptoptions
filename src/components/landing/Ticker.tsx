import { useEffect, useState } from "react";
import { fetchSpot } from "@/lib/delta";

export function Ticker() {
  const [btc, setBtc] = useState<number | null>(null);
  const [eth, setEth] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [b, e] = await Promise.all([fetchSpot('BTCUSD'), fetchSpot('ETHUSD')]);
      if (!mounted) return;
      if (b?.mark_price ?? b?.close) setBtc(parseFloat(b!.mark_price ?? b!.close!));
      if (e?.mark_price ?? e?.close) setEth(parseFloat(e!.mark_price ?? e!.close!));
    };
    load();
    const id = setInterval(load, 5000);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  const items = [
    { s: 'BTC/USD', v: btc, c: 'text-accent' },
    { s: 'ETH/USD', v: eth, c: 'text-primary-glow' },
    { s: 'BTC IV', v: 58.2, suffix: '%' },
    { s: 'ETH IV', v: 64.8, suffix: '%' },
    { s: 'BTC OI', v: 1.24, suffix: 'B', prefix: '$' },
    { s: 'ETH OI', v: 0.62, suffix: 'B', prefix: '$' },
  ];
  return (
    <div className="border-y border-border bg-card/50 overflow-hidden py-2">
      <div className="flex gap-12 ticker-scroll whitespace-nowrap">
        {[...items, ...items, ...items].map((i, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm font-mono">
            <span className="text-muted-foreground">{i.s}</span>
            <span className={i.c ?? 'text-foreground'}>{i.prefix ?? ''}{i.v?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '—'}{i.suffix ?? ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

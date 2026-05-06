import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { fetchOptionsTickers, parseExpiryFromSymbol, expiryLabel, type DeltaTicker } from "@/lib/delta";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { usePaper } from "@/contexts/PaperContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LoginDialog } from "@/components/LoginDialog";

interface ChainRow {
  strike: number;
  call?: DeltaTicker;
  put?: DeltaTicker;
}

function num(v?: string) { return v ? parseFloat(v) : NaN; }
function fmt(v?: string | number, d = 2) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (n === undefined || isNaN(n!)) return '—';
  return n!.toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });
}

export default function OptionChain() {
  const [underlying, setUnderlying] = useState<'BTC' | 'ETH'>('BTC');
  const [tickers, setTickers] = useState<DeltaTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiry, setExpiry] = useState<string>('');
  const [login, setLogin] = useState(false);
  const { user } = useAuth();
  const { openPosition } = usePaper();

  const load = async () => {
    setLoading(true);
    try {
      const t = await fetchOptionsTickers(underlying);
      setTickers(t);
    } catch (e) { toast.error("Failed to load chain"); }
    setLoading(false);
  };
  useEffect(() => { load(); const id = setInterval(load, 8000); return () => clearInterval(id); /* eslint-disable-next-line */ }, [underlying]);

  const expiries = useMemo(() => {
    const set = new Set<string>();
    tickers.forEach(t => { const e = parseExpiryFromSymbol(t.symbol); if (e) set.add(e); });
    return [...set].sort();
  }, [tickers]);

  useEffect(() => { if (expiries.length && !expiries.includes(expiry)) setExpiry(expiries[0]); }, [expiries, expiry]);

  const rows: ChainRow[] = useMemo(() => {
    const m = new Map<number, ChainRow>();
    tickers.forEach(t => {
      if (parseExpiryFromSymbol(t.symbol) !== expiry) return;
      const k = num(t.strike_price);
      if (isNaN(k)) return;
      let r = m.get(k);
      if (!r) { r = { strike: k }; m.set(k, r); }
      if (t.symbol.startsWith('C-')) r.call = t;
      else if (t.symbol.startsWith('P-')) r.put = t;
    });
    return [...m.values()].sort((a, b) => a.strike - b.strike);
  }, [tickers, expiry]);

  const spot = useMemo(() => {
    const t = tickers.find(x => x.spot_price);
    return t ? parseFloat(t.spot_price!) : NaN;
  }, [tickers]);

  const handleTrade = (t: DeltaTicker, side: 'BUY' | 'SELL') => {
    if (!user) { setLogin(true); return; }
    const price = num(t.mark_price);
    if (isNaN(price)) { toast.error("No price"); return; }
    openPosition({
      symbol: t.symbol,
      underlying,
      type: t.symbol.startsWith('C-') ? 'C' : 'P',
      strike: num(t.strike_price),
      expiry: parseExpiryFromSymbol(t.symbol) || '',
      side, qty: 1, entryPrice: price,
    });
    toast.success(`${side} 1 ${t.symbol} @ ~${fmt(price)} (paper)`);
  };

  return (
    <PageShell title="Option Chain" subtitle="Live BTC & ETH options from Delta Exchange India · Paper trading only">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Tabs value={underlying} onValueChange={(v) => setUnderlying(v as 'BTC' | 'ETH')}>
          <TabsList><TabsTrigger value="BTC">BTC</TabsTrigger><TabsTrigger value="ETH">ETH</TabsTrigger></TabsList>
        </Tabs>
        <Select value={expiry} onValueChange={setExpiry}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Expiry" /></SelectTrigger>
          <SelectContent>
            {expiries.map(e => <SelectItem key={e} value={e}>{expiryLabel(e)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
        {!isNaN(spot) && (
          <div className="ml-auto text-sm">
            Spot <span className="font-mono font-semibold text-gradient">${fmt(spot)}</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-xs lg:text-sm">
            <thead className="bg-secondary/50 sticky top-0">
              <tr>
                <th colSpan={5} className="text-bull font-semibold py-2">CALLS</th>
                <th className="text-center py-2">STRIKE</th>
                <th colSpan={5} className="text-bear font-semibold py-2">PUTS</th>
              </tr>
              <tr className="text-muted-foreground">
                <th className="px-2 py-2 text-left">OI</th><th className="px-2 py-2">IV</th><th className="px-2 py-2">Bid</th><th className="px-2 py-2">Ask</th><th className="px-2 py-2">Trade</th>
                <th className="px-2 py-2 text-center font-mono">—</th>
                <th className="px-2 py-2">Trade</th><th className="px-2 py-2">Bid</th><th className="px-2 py-2">Ask</th><th className="px-2 py-2">IV</th><th className="px-2 py-2 text-right">OI</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12"><Loader2 className="inline animate-spin mr-2 h-4 w-4" />Loading live chain…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-muted-foreground">No data for this expiry</td></tr>
              ) : rows.map(r => {
                const itmCall = !isNaN(spot) && r.strike < spot;
                const itmPut = !isNaN(spot) && r.strike > spot;
                return (
                  <tr key={r.strike} className="border-t border-border hover:bg-secondary/30">
                    <td className={`px-2 py-1.5 ${itmCall ? 'bg-bull/5' : ''}`}>{fmt(r.call?.oi, 0)}</td>
                    <td className={`px-2 py-1.5 text-center ${itmCall ? 'bg-bull/5' : ''}`}>{r.call?.quotes?.mark_iv ? `${(parseFloat(r.call.quotes.mark_iv)*100).toFixed(1)}` : '—'}</td>
                    <td className={`px-2 py-1.5 text-center font-mono ${itmCall ? 'bg-bull/5' : ''}`}>{fmt(r.call?.quotes?.best_bid)}</td>
                    <td className={`px-2 py-1.5 text-center font-mono ${itmCall ? 'bg-bull/5' : ''}`}>{fmt(r.call?.quotes?.best_ask)}</td>
                    <td className={`px-2 py-1.5 ${itmCall ? 'bg-bull/5' : ''}`}>
                      {r.call && <div className="flex gap-1"><Button size="sm" variant="outline" className="h-6 px-2 text-[10px] border-bull/40 text-bull hover:bg-bull/10" onClick={() => handleTrade(r.call!, 'BUY')}>B</Button><Button size="sm" variant="outline" className="h-6 px-2 text-[10px] border-bear/40 text-bear hover:bg-bear/10" onClick={() => handleTrade(r.call!, 'SELL')}>S</Button></div>}
                    </td>
                    <td className="px-2 py-1.5 text-center font-mono font-semibold">{r.strike.toLocaleString()}</td>
                    <td className={`px-2 py-1.5 ${itmPut ? 'bg-bear/5' : ''}`}>
                      {r.put && <div className="flex gap-1"><Button size="sm" variant="outline" className="h-6 px-2 text-[10px] border-bull/40 text-bull hover:bg-bull/10" onClick={() => handleTrade(r.put!, 'BUY')}>B</Button><Button size="sm" variant="outline" className="h-6 px-2 text-[10px] border-bear/40 text-bear hover:bg-bear/10" onClick={() => handleTrade(r.put!, 'SELL')}>S</Button></div>}
                    </td>
                    <td className={`px-2 py-1.5 text-center font-mono ${itmPut ? 'bg-bear/5' : ''}`}>{fmt(r.put?.quotes?.best_bid)}</td>
                    <td className={`px-2 py-1.5 text-center font-mono ${itmPut ? 'bg-bear/5' : ''}`}>{fmt(r.put?.quotes?.best_ask)}</td>
                    <td className={`px-2 py-1.5 text-center ${itmPut ? 'bg-bear/5' : ''}`}>{r.put?.quotes?.mark_iv ? `${(parseFloat(r.put.quotes.mark_iv)*100).toFixed(1)}` : '—'}</td>
                    <td className={`px-2 py-1.5 text-right ${itmPut ? 'bg-bear/5' : ''}`}>{fmt(r.put?.oi, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <LoginDialog open={login} onOpenChange={setLogin} />
    </PageShell>
  );
}

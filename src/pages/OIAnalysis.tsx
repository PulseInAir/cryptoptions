import { PageShell } from "@/components/layout/PageShell";
import { useEffect, useMemo, useState } from "react";
import { fetchOptionsTickers, parseExpiryFromSymbol, expiryLabel, type DeltaTicker } from "@/lib/delta";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, CartesianGrid, Legend } from "recharts";

export default function OIAnalysis() {
  const [underlying, setUnderlying] = useState<'BTC' | 'ETH'>('BTC');
  const [tickers, setTickers] = useState<DeltaTicker[]>([]);
  const [expiry, setExpiry] = useState('');

  useEffect(() => {
    const load = async () => setTickers(await fetchOptionsTickers(underlying));
    load(); const id = setInterval(load, 10000); return () => clearInterval(id);
  }, [underlying]);

  const expiries = useMemo(() => {
    const s = new Set<string>();
    tickers.forEach(t => { const e = parseExpiryFromSymbol(t.symbol); if (e) s.add(e); });
    return [...s].sort();
  }, [tickers]);
  useEffect(() => { if (expiries.length && !expiries.includes(expiry)) setExpiry(expiries[0]); }, [expiries, expiry]);

  const { data, spot, pcr, maxPain } = useMemo(() => {
    const m = new Map<number, { strike: number; callOI: number; putOI: number }>();
    let spotPx = NaN;
    tickers.forEach(t => {
      if (parseExpiryFromSymbol(t.symbol) !== expiry) return;
      const k = parseFloat(t.strike_price ?? '');
      if (isNaN(k)) return;
      if (!isNaN(parseFloat(t.spot_price ?? ''))) spotPx = parseFloat(t.spot_price!);
      let r = m.get(k); if (!r) { r = { strike: k, callOI: 0, putOI: 0 }; m.set(k, r); }
      const oi = parseFloat(t.oi ?? '0') || 0;
      if (t.symbol.startsWith('C-')) r.callOI = oi;
      else if (t.symbol.startsWith('P-')) r.putOI = oi;
    });
    const arr = [...m.values()].sort((a, b) => a.strike - b.strike).map(r => ({ ...r, putOI: -r.putOI }));
    const tCall = arr.reduce((s, r) => s + r.callOI, 0);
    const tPut = arr.reduce((s, r) => s + Math.abs(r.putOI), 0);
    // max pain
    const strikes = arr.map(r => r.strike);
    let mp = strikes[0], best = Infinity;
    strikes.forEach(K => {
      const pain = arr.reduce((s, r) => {
        const callPain = r.callOI * Math.max(K - r.strike, 0);
        const putPain = Math.abs(r.putOI) * Math.max(r.strike - K, 0);
        return s + callPain + putPain;
      }, 0);
      if (pain < best) { best = pain; mp = K; }
    });
    return { data: arr, spot: spotPx, pcr: tCall ? (tPut / tCall).toFixed(2) : '—', maxPain: mp };
  }, [tickers, expiry]);

  return (
    <PageShell title="OI Analysis" subtitle="Open interest distribution, max pain & put/call ratio">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Tabs value={underlying} onValueChange={(v) => setUnderlying(v as 'BTC' | 'ETH')}>
          <TabsList><TabsTrigger value="BTC">BTC</TabsTrigger><TabsTrigger value="ETH">ETH</TabsTrigger></TabsList>
        </Tabs>
        <Select value={expiry} onValueChange={setExpiry}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Expiry" /></SelectTrigger>
          <SelectContent>{expiries.map(e => <SelectItem key={e} value={e}>{expiryLabel(e)}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="shadow-card"><CardContent className="p-5"><div className="text-xs text-muted-foreground">Spot</div><div className="text-2xl font-bold font-mono text-gradient">{isNaN(spot) ? '—' : `$${spot.toLocaleString()}`}</div></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5"><div className="text-xs text-muted-foreground">Put/Call OI Ratio</div><div className="text-2xl font-bold font-mono">{pcr}</div></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5"><div className="text-xs text-muted-foreground">Max Pain</div><div className="text-2xl font-bold font-mono text-accent">${maxPain?.toLocaleString()}</div></CardContent></Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle>OI Distribution by Strike</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={460}>
            <BarChart data={data} stackOffset="sign">
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="strike" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.toLocaleString()} />
              <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => Math.abs(v).toLocaleString()} />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => Math.abs(v).toLocaleString()} />
              <Legend />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              {!isNaN(spot) && <ReferenceLine x={Math.round(spot/1000)*1000} stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: 'Spot', fill: 'hsl(var(--accent))' }} />}
              <Bar dataKey="callOI" name="Call OI" fill="hsl(var(--bull))" />
              <Bar dataKey="putOI" name="Put OI" fill="hsl(var(--bear))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageShell>
  );
}

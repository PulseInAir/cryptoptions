import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { bs } from "@/lib/blackScholes";
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface Leg { id: string; type: 'C' | 'P'; side: 'BUY' | 'SELL'; strike: number; qty: number; iv: number; }

const presets: Record<string, (spot: number) => Leg[]> = {
  'long-call': (s) => [{ id: '1', type: 'C', side: 'BUY', strike: Math.round(s/1000)*1000, qty: 1, iv: 60 }],
  'long-put': (s) => [{ id: '1', type: 'P', side: 'BUY', strike: Math.round(s/1000)*1000, qty: 1, iv: 60 }],
  'long-straddle': (s) => [
    { id: '1', type: 'C', side: 'BUY', strike: Math.round(s/1000)*1000, qty: 1, iv: 60 },
    { id: '2', type: 'P', side: 'BUY', strike: Math.round(s/1000)*1000, qty: 1, iv: 60 },
  ],
  'short-strangle': (s) => [
    { id: '1', type: 'C', side: 'SELL', strike: Math.round(s/1000)*1000 + 5000, qty: 1, iv: 60 },
    { id: '2', type: 'P', side: 'SELL', strike: Math.round(s/1000)*1000 - 5000, qty: 1, iv: 60 },
  ],
  'iron-condor': (s) => {
    const k = Math.round(s/1000)*1000;
    return [
      { id: '1', type: 'P', side: 'BUY', strike: k - 8000, qty: 1, iv: 60 },
      { id: '2', type: 'P', side: 'SELL', strike: k - 4000, qty: 1, iv: 60 },
      { id: '3', type: 'C', side: 'SELL', strike: k + 4000, qty: 1, iv: 60 },
      { id: '4', type: 'C', side: 'BUY', strike: k + 8000, qty: 1, iv: 60 },
    ];
  },
  'bull-call-spread': (s) => {
    const k = Math.round(s/1000)*1000;
    return [
      { id: '1', type: 'C', side: 'BUY', strike: k, qty: 1, iv: 60 },
      { id: '2', type: 'C', side: 'SELL', strike: k + 5000, qty: 1, iv: 60 },
    ];
  },
};

export default function StrategyBuilder() {
  const [spot, setSpot] = useState(95000);
  const [dte, setDte] = useState(7);
  const [legs, setLegs] = useState<Leg[]>(presets['long-straddle'](95000));
  const r = 0.06;

  const T = dte / 365;

  const legPx = (l: Leg, S: number, sigmaShift = 0) =>
    bs(l.type, S, l.strike, T, r, Math.max(0.05, (l.iv + sigmaShift) / 100));

  const entryCost = useMemo(() => legs.reduce((sum, l) => {
    const p = legPx(l, spot).price;
    return sum + (l.side === 'BUY' ? 1 : -1) * p * l.qty;
  }, 0), [legs, spot, dte]);

  const greeks = useMemo(() => {
    const init = { delta: 0, gamma: 0, theta: 0, vega: 0 };
    return legs.reduce((acc, l) => {
      const g = legPx(l, spot);
      const sign = l.side === 'BUY' ? 1 : -1;
      return {
        delta: acc.delta + sign * g.delta * l.qty,
        gamma: acc.gamma + sign * g.gamma * l.qty,
        theta: acc.theta + sign * g.theta * l.qty,
        vega: acc.vega + sign * g.vega * l.qty,
      };
    }, init);
  }, [legs, spot, dte]);

  const data = useMemo(() => {
    const range = spot * 0.25;
    const pts = 80;
    return Array.from({ length: pts + 1 }, (_, i) => {
      const S = spot - range + (2 * range * i) / pts;
      // expiry payoff
      const expPnl = legs.reduce((sum, l) => {
        const intrinsic = l.type === 'C' ? Math.max(S - l.strike, 0) : Math.max(l.strike - S, 0);
        const sign = l.side === 'BUY' ? 1 : -1;
        return sum + sign * intrinsic * l.qty;
      }, 0) - entryCost;
      // current (T0) payoff
      const curPnl = legs.reduce((sum, l) => {
        const sign = l.side === 'BUY' ? 1 : -1;
        return sum + sign * legPx(l, S).price * l.qty;
      }, 0) - entryCost;
      return { S: Math.round(S), expiry: +expPnl.toFixed(2), now: +curPnl.toFixed(2) };
    });
  }, [legs, spot, dte, entryCost]);

  const update = (id: string, patch: Partial<Leg>) => setLegs(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
  const add = () => setLegs(ls => [...ls, { id: crypto.randomUUID(), type: 'C', side: 'BUY', strike: spot, qty: 1, iv: 60 }]);
  const remove = (id: string) => setLegs(ls => ls.filter(l => l.id !== id));
  const loadPreset = (k: string) => setLegs(presets[k](spot).map(l => ({ ...l, id: crypto.randomUUID() })));

  const maxProfit = Math.max(...data.map(d => d.expiry));
  const maxLoss = Math.min(...data.map(d => d.expiry));

  return (
    <PageShell title="Strategy Builder" subtitle="Build, analyze, forward-test BTC/ETH options strategies">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle>Payoff Diagram</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={data}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis dataKey="S" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.toLocaleString()} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} formatter={(v: number) => v.toLocaleString()} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                  <ReferenceLine x={spot} stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: 'Spot', fill: 'hsl(var(--accent))', fontSize: 11 }} />
                  <Line type="monotone" dataKey="expiry" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="At Expiry" />
                  <Line type="monotone" dataKey="now" stroke="hsl(var(--primary-glow))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Today (T+0)" />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <Stat l="Net Cost" v={entryCost.toFixed(2)} c={entryCost >= 0 ? 'text-bear' : 'text-bull'} />
                <Stat l="Max Profit" v={maxProfit.toFixed(0)} c="text-bull" />
                <Stat l="Max Loss" v={maxLoss.toFixed(0)} c="text-bear" />
                <Stat l="R:R" v={maxLoss !== 0 ? (Math.abs(maxProfit / maxLoss)).toFixed(2) : '∞'} c="" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle>Legs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {legs.map(l => (
                <div key={l.id} className="grid grid-cols-12 gap-2 items-center">
                  <Select value={l.side} onValueChange={(v) => update(l.id, { side: v as 'BUY' | 'SELL' })}>
                    <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="BUY">BUY</SelectItem><SelectItem value="SELL">SELL</SelectItem></SelectContent>
                  </Select>
                  <Select value={l.type} onValueChange={(v) => update(l.id, { type: v as 'C' | 'P' })}>
                    <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="C">CALL</SelectItem><SelectItem value="P">PUT</SelectItem></SelectContent>
                  </Select>
                  <Input className="col-span-3" type="number" value={l.strike} onChange={e => update(l.id, { strike: +e.target.value })} placeholder="Strike" />
                  <Input className="col-span-2" type="number" value={l.qty} onChange={e => update(l.id, { qty: +e.target.value })} placeholder="Qty" />
                  <Input className="col-span-2" type="number" value={l.iv} onChange={e => update(l.id, { iv: +e.target.value })} placeholder="IV%" />
                  <Button variant="ghost" size="icon" className="col-span-1" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={add} className="w-full mt-2"><Plus className="h-4 w-4 mr-1" /> Add Leg</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle>Inputs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><label className="text-xs text-muted-foreground">Underlying Spot</label><Input type="number" value={spot} onChange={e => setSpot(+e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Days to Expiry</label><Input type="number" value={dte} onChange={e => setDte(+e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle>Portfolio Greeks</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <Greek l="Δ Delta" v={greeks.delta.toFixed(3)} />
              <Greek l="Γ Gamma" v={greeks.gamma.toFixed(5)} />
              <Greek l="Θ Theta /day" v={greeks.theta.toFixed(2)} />
              <Greek l="V Vega /1%" v={greeks.vega.toFixed(2)} />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle>Presets</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {Object.keys(presets).map(k => (
                <Button key={k} variant="outline" size="sm" onClick={() => loadPreset(k)} className="capitalize justify-start">{k.replace(/-/g, ' ')}</Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ l, v, c }: { l: string; v: string; c: string }) {
  return <div className="rounded-lg bg-secondary/50 p-3"><div className="text-xs text-muted-foreground">{l}</div><div className={`font-mono font-semibold ${c}`}>{v}</div></div>;
}
function Greek({ l, v }: { l: string; v: string }) {
  return <div className="rounded-lg bg-secondary/50 p-3"><div className="text-xs text-muted-foreground">{l}</div><div className="font-mono font-semibold text-gradient">{v}</div></div>;
}

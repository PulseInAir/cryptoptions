import { PageShell } from "@/components/layout/PageShell";
import { usePaper } from "@/contexts/PaperContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, RotateCcw } from "lucide-react";
import { LoginDialog } from "@/components/LoginDialog";
import { useState, useEffect } from "react";
import { fetchOptionsTickers, type DeltaTicker } from "@/lib/delta";
import { toast } from "sonner";

export default function PaperTrading() {
  const { user } = useAuth();
  const { cash, positions, closePosition, reset } = usePaper();
  const [login, setLogin] = useState(false);
  const [tickers, setTickers] = useState<Record<string, DeltaTicker>>({});

  useEffect(() => {
    const load = async () => {
      const u = new Set(positions.map(p => p.underlying));
      const arrs = await Promise.all([...u].map(x => fetchOptionsTickers(x)));
      const m: Record<string, DeltaTicker> = {};
      arrs.flat().forEach(t => { m[t.symbol] = t; });
      setTickers(m);
    };
    if (positions.length) { load(); const id = setInterval(load, 8000); return () => clearInterval(id); }
  }, [positions.length]);

  if (!user) {
    return (
      <PageShell title="Paper Trading">
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-card">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Login to start paper trading</h2>
          <p className="text-muted-foreground mb-6">Get ₹10,00,000 virtual capital. Trade BTC/ETH options with live Delta data. Zero risk.</p>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={() => setLogin(true)}>Login Now</Button>
        </div>
        <LoginDialog open={login} onOpenChange={setLogin} />
      </PageShell>
    );
  }

  const mtm = positions.reduce((sum, p) => {
    const t = tickers[p.symbol];
    if (!t?.mark_price) return sum;
    const mark = parseFloat(t.mark_price);
    const pnl = (mark - p.entryPrice) * p.qty * (p.side === 'BUY' ? 1 : -1);
    return sum + pnl;
  }, 0);

  return (
    <PageShell title="Paper Trading" subtitle={`Virtual portfolio · Welcome ${user.name}`}>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Cash" value={`₹${cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={Wallet} />
        <StatCard label="Open Positions" value={positions.length.toString()} icon={TrendingUp} />
        <StatCard label="Unrealized P&L" value={`₹${mtm.toFixed(0)}`} className={mtm >= 0 ? 'text-bull' : 'text-bear'} icon={TrendingUp} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Open Paper Positions</CardTitle>
          <Button variant="outline" size="sm" onClick={() => { if (confirm('Reset paper portfolio?')) { reset(); toast.success('Reset done'); } }}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No open positions. Head to the <Link className="text-primary underline" to="/option-chain">Option Chain</Link> to place your first paper trade.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr><th className="text-left p-2">Symbol</th><th className="text-left p-2">Side</th><th className="text-right p-2">Qty</th><th className="text-right p-2">Entry</th><th className="text-right p-2">Mark</th><th className="text-right p-2">P&L</th><th className="p-2"></th></tr>
                </thead>
                <tbody>
                  {positions.map(p => {
                    const t = tickers[p.symbol];
                    const mark = t?.mark_price ? parseFloat(t.mark_price) : p.entryPrice;
                    const pnl = (mark - p.entryPrice) * p.qty * (p.side === 'BUY' ? 1 : -1);
                    return (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="p-2 font-mono">{p.symbol}</td>
                        <td className="p-2"><span className={p.side === 'BUY' ? 'text-bull' : 'text-bear'}>{p.side}</span></td>
                        <td className="p-2 text-right">{p.qty}</td>
                        <td className="p-2 text-right font-mono">{p.entryPrice.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono">{mark.toFixed(2)}</td>
                        <td className={`p-2 text-right font-mono font-semibold ${pnl >= 0 ? 'text-bull' : 'text-bear'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}</td>
                        <td className="p-2 text-right"><Button size="sm" variant="outline" onClick={() => closePosition(p.id, mark)}>Close</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}

function StatCard({ label, value, className, icon: Icon }: { label: string; value: string; className?: string; icon: any }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={`text-2xl font-bold font-mono ${className ?? ''}`}>{value}</div>
        </div>
        <Icon className="h-8 w-8 text-primary opacity-60" />
      </CardContent>
    </Card>
  );
}

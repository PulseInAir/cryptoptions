import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface PaperPosition {
  id: string;
  symbol: string;
  underlying: 'BTC' | 'ETH';
  type: 'C' | 'P';
  strike: number;
  expiry: string;
  side: 'BUY' | 'SELL';
  qty: number;
  entryPrice: number;
  entryTime: number;
}
interface Ctx {
  cash: number;
  positions: PaperPosition[];
  openPosition: (p: Omit<PaperPosition, 'id' | 'entryTime'>) => void;
  closePosition: (id: string, exitPrice: number) => void;
  reset: () => void;
}
const C = createContext<Ctx | undefined>(undefined);
const KEY = 'cb_paper_v1';
const INIT_CASH = 1_000_000; // ₹10L virtual

export function PaperProvider({ children }: { children: ReactNode }) {
  const [cash, setCash] = useState(INIT_CASH);
  const [positions, setPositions] = useState<PaperPosition[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw); setCash(s.cash); setPositions(s.positions); }
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify({ cash, positions })); }, [cash, positions]);

  const openPosition = useCallback((p: Omit<PaperPosition, 'id' | 'entryTime'>) => {
    // simulate slippage
    const slip = (Math.random() * 0.004 - 0.002) * p.entryPrice;
    const fill = Math.max(0.01, p.entryPrice + slip);
    const cost = fill * p.qty * (p.side === 'BUY' ? 1 : -1);
    setCash(c => c - cost);
    setPositions(ps => [...ps, { ...p, entryPrice: fill, id: crypto.randomUUID(), entryTime: Date.now() }]);
  }, []);

  const closePosition = useCallback((id: string, exitPrice: number) => {
    setPositions(ps => {
      const pos = ps.find(p => p.id === id);
      if (!pos) return ps;
      const proceeds = exitPrice * pos.qty * (pos.side === 'BUY' ? 1 : -1);
      setCash(c => c + proceeds);
      return ps.filter(p => p.id !== id);
    });
  }, []);

  const reset = () => { setCash(INIT_CASH); setPositions([]); };

  return <C.Provider value={{ cash, positions, openPosition, closePosition, reset }}>{children}</C.Provider>;
}
export const usePaper = () => useContext(C)!;

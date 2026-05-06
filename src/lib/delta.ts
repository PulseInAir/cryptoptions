import { supabase } from "@/integrations/supabase/client";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delta-proxy`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function call(params: Record<string, string>) {
  const u = new URL(FN_URL);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u.toString(), { headers: { Authorization: `Bearer ${KEY}`, apikey: KEY } });
  if (!r.ok) throw new Error(`Delta proxy ${r.status}`);
  return r.json();
}

export interface DeltaTicker {
  symbol: string;
  product_id?: number;
  contract_type?: string;
  strike_price?: string;
  spot_price?: string;
  mark_price?: string;
  oi?: string;
  oi_value?: string;
  oi_value_usd?: string;
  volume?: string;
  turnover_usd?: string;
  greeks?: { delta?: number; gamma?: number; theta?: number; vega?: number; rho?: number };
  quotes?: { best_bid?: string; best_ask?: string; bid_iv?: string; ask_iv?: string; mark_iv?: string };
  underlying_asset_symbol?: string;
  expiry?: string;
  close?: string;
}

export async function fetchOptionsTickers(underlying: 'BTC' | 'ETH'): Promise<DeltaTicker[]> {
  const data = await call({ action: 'tickers', underlying_asset_symbols: underlying, contract_types: 'call_options,put_options' });
  return data.result ?? [];
}

export async function fetchSpot(symbol: 'BTCUSD' | 'ETHUSD'): Promise<DeltaTicker | null> {
  try {
    const data = await call({ action: 'ticker', symbol });
    return data.result ?? null;
  } catch { return null; }
}

// Parse expiry from symbol like "C-BTC-95000-071226" -> Date for 07-Dec-2026
export function parseExpiryFromSymbol(sym: string): string | null {
  const parts = sym.split('-');
  if (parts.length < 4) return null;
  const d = parts[3];
  if (d.length !== 6) return null;
  const dd = d.slice(0, 2), mm = d.slice(2, 4), yy = d.slice(4, 6);
  return `20${yy}-${mm}-${dd}`;
}

export function expiryLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const days = Math.round((d.getTime() - today.getTime()) / 86400000);
  const fmt = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'UTC' });
  return `${fmt} (${days}d)`;
}

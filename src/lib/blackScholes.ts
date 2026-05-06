// Black-Scholes pricing & Greeks for European options.
const SQRT_2PI = Math.sqrt(2 * Math.PI);
function normPdf(x: number) { return Math.exp(-0.5 * x * x) / SQRT_2PI; }
function normCdf(x: number) {
  // Abramowitz & Stegun
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return 0.5 * (1 + sign * y);
}

export interface Greeks { price: number; delta: number; gamma: number; theta: number; vega: number; rho: number; }

export function bs(type: 'C' | 'P', S: number, K: number, T: number, r: number, sigma: number): Greeks {
  if (T <= 0 || sigma <= 0) {
    const intrinsic = type === 'C' ? Math.max(S - K, 0) : Math.max(K - S, 0);
    return { price: intrinsic, delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const Nd1 = normCdf(d1), Nd2 = normCdf(d2);
  const nd1 = normPdf(d1);
  if (type === 'C') {
    return {
      price: S * Nd1 - K * Math.exp(-r * T) * Nd2,
      delta: Nd1,
      gamma: nd1 / (S * sigma * Math.sqrt(T)),
      theta: (-S * nd1 * sigma / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2) / 365,
      vega: S * nd1 * Math.sqrt(T) / 100,
      rho: K * T * Math.exp(-r * T) * Nd2 / 100,
    };
  } else {
    return {
      price: K * Math.exp(-r * T) * normCdf(-d2) - S * normCdf(-d1),
      delta: Nd1 - 1,
      gamma: nd1 / (S * sigma * Math.sqrt(T)),
      theta: (-S * nd1 * sigma / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normCdf(-d2)) / 365,
      vega: S * nd1 * Math.sqrt(T) / 100,
      rho: -K * T * Math.exp(-r * T) * normCdf(-d2) / 100,
    };
  }
}

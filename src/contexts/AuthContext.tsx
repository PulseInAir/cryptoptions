import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface MockUser { name: string; email: string; provider: 'delta' | 'google'; plan: 'free' | 'pro'; }
interface Ctx { user: MockUser | null; login: (provider: 'delta' | 'google') => void; logout: () => void; upgrade: () => void; }

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('cb_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);
  const login = (provider: 'delta' | 'google') => {
    const u: MockUser = provider === 'delta'
      ? { name: 'Delta Trader', email: 'trader@delta.exchange', provider, plan: 'free' }
      : { name: 'Google User', email: 'user@gmail.com', provider, plan: 'free' };
    localStorage.setItem('cb_user', JSON.stringify(u));
    setUser(u);
  };
  const logout = () => { localStorage.removeItem('cb_user'); setUser(null); };
  const upgrade = () => {
    if (!user) return;
    const u = { ...user, plan: 'pro' as const };
    localStorage.setItem('cb_user', JSON.stringify(u));
    setUser(u);
  };
  return <AuthCtx.Provider value={{ user, login, logout, upgrade }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth outside provider');
  return c;
}

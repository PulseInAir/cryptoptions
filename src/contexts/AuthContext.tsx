import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { Session, User } from "@supabase/supabase-js";

export type Plan = 'free' | 'pro' | 'admin';

interface Profile { display_name: string | null; avatar_url: string | null; email: string | null; }

interface Ctx {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  plan: Plan;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpEmail: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshPlan: () => Promise<void>;
}

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<Plan>('free');
  const [loading, setLoading] = useState(true);

  const loadProfileAndPlan = async (uid: string) => {
    const [{ data: prof }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('display_name, avatar_url, email').eq('id', uid).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', uid),
    ]);
    setProfile(prof ?? null);
    const rs = (roles ?? []).map(r => r.role as string);
    setPlan(rs.includes('admin') ? 'admin' : rs.includes('pro') ? 'pro' : 'free');
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => loadProfileAndPlan(s.user.id), 0);
      } else {
        setProfile(null); setPlan('free');
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s); setUser(s?.user ?? null);
      if (s?.user) loadProfileAndPlan(s.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUpEmail = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: displayName },
      },
    });
    return { error: error?.message ?? null };
  };

  const signInGoogle = async () => {
    await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/dashboard` });
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const refreshPlan = async () => { if (user) await loadProfileAndPlan(user.id); };

  return (
    <AuthCtx.Provider value={{ user, session, profile, plan, loading, signInEmail, signUpEmail, signInGoogle, logout, refreshPlan }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth outside provider');
  return c;
}

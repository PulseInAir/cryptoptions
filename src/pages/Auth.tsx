import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { TrendingUp, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);
const passSchema = z.string().min(8).max(72);
const nameSchema = z.string().trim().min(1).max(80);

export default function Auth() {
  const { user, signInEmail, signUpEmail, signInGoogle } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav('/dashboard'); }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const ev = emailSchema.safeParse(email); if (!ev.success) { toast.error("Invalid email"); return; }
      const pv = passSchema.safeParse(password); if (!pv.success) { toast.error("Password must be 8–72 characters"); return; }
      if (mode === 'signup') {
        const nv = nameSchema.safeParse(name); if (!nv.success) { toast.error("Enter your name"); return; }
        const { error } = await signUpEmail(ev.data, pv.data, nv.data);
        if (error) toast.error(error); else { toast.success("Account created!"); nav('/dashboard'); }
      } else {
        const { error } = await signInEmail(ev.data, pv.data);
        if (error) toast.error(error); else nav('/dashboard');
      }
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Crypt<span className="text-gradient">Options</span></span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'signup')}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value={mode}>
              <form onSubmit={submit} className="space-y-4">
                {mode === 'signup' && (
                  <div><Label>Name</Label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" /></div>
                )}
                <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></div>
                <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required /></div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground shadow-glow h-11">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === 'login' ? 'Login' : 'Create account')}
                </Button>
              </form>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" /></div>
              <Button onClick={signInGoogle} variant="outline" className="w-full h-11">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </Button>
              <p className="mt-6 text-center text-xs text-muted-foreground">Paper trading only · No real orders · Live Delta Exchange India market data</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

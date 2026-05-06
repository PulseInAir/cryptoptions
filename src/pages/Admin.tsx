import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Shield, Crown, User as UserIcon } from "lucide-react";

interface Row {
  id: string; email: string | null; display_name: string | null; created_at: string;
  roles: string[];
}

export default function Admin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const [{ data: profs }, { data: roles }, { data: pays }] = await Promise.all([
      supabase.from('profiles').select('id, email, display_name, created_at').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role'),
      supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    const byUser = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = byUser.get(r.user_id) ?? []; arr.push(r.role); byUser.set(r.user_id, arr);
    });
    setRows((profs ?? []).map((p: any) => ({ ...p, roles: byUser.get(p.id) ?? ['free'] })));
    setPayments(pays ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const grant = async (userId: string, role: 'pro' | 'admin') => {
    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role });
    if (error) toast.error(error.message); else { toast.success(`Granted ${role}`); load(); }
  };
  const revoke = async (userId: string, role: 'pro' | 'admin') => {
    const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
    if (error) toast.error(error.message); else { toast.success(`Revoked ${role}`); load(); }
  };

  return (
    <PageShell title="Admin Dashboard" subtitle="Manage users, roles, and payments">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total users" value={rows.length} icon={UserIcon} />
        <Stat label="Pro users" value={rows.filter(r => r.roles.includes('pro')).length} icon={Crown} />
        <Stat label="Admins" value={rows.filter(r => r.roles.includes('admin')).length} icon={Shield} />
      </div>

      <Card className="shadow-card mb-6">
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="py-8 text-center"><Loader2 className="inline animate-spin h-5 w-5" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-left">
                  <tr><th className="py-2">Email</th><th>Name</th><th>Roles</th><th>Joined</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const isPro = r.roles.includes('pro');
                    const isAdmin = r.roles.includes('admin');
                    return (
                      <tr key={r.id} className="border-t border-border">
                        <td className="py-2 font-mono text-xs">{r.email}</td>
                        <td>{r.display_name || '—'}</td>
                        <td>
                          <div className="flex gap-1">
                            {r.roles.map(role => <Badge key={role} variant={role === 'admin' ? 'default' : role === 'pro' ? 'secondary' : 'outline'}>{role}</Badge>)}
                          </div>
                        </td>
                        <td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-1">
                            {isPro
                              ? <Button size="sm" variant="outline" onClick={() => revoke(r.id, 'pro')}>Revoke Pro</Button>
                              : <Button size="sm" variant="outline" onClick={() => grant(r.id, 'pro')}>Grant Pro</Button>}
                            {isAdmin
                              ? <Button size="sm" variant="outline" onClick={() => revoke(r.id, 'admin')}>Revoke Admin</Button>
                              : <Button size="sm" variant="outline" onClick={() => grant(r.id, 'admin')}>Grant Admin</Button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground text-left"><tr><th className="py-2">Order</th><th>Amount</th><th>Status</th><th>Plan</th><th>Date</th></tr></thead>
              <tbody>
                {payments.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No payments yet</td></tr>}
                {payments.map(p => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2 font-mono text-xs">{p.razorpay_order_id}</td>
                    <td>₹{(p.amount / 100).toLocaleString()}</td>
                    <td><Badge variant={p.status === 'paid' ? 'default' : 'outline'}>{p.status}</Badge></td>
                    <td>{p.plan}</td>
                    <td className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <Card className="shadow-card"><CardContent className="pt-6 flex items-center justify-between">
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="text-3xl font-bold mt-1">{value}</div></div>
      <Icon className="h-8 w-8 text-primary opacity-60" />
    </CardContent></Card>
  );
}

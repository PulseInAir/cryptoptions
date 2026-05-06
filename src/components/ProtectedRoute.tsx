import { Navigate } from "react-router-dom";
import { useAuth, type Plan } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, require }: { children: React.ReactNode; require?: 'pro' | 'admin' }) {
  const { user, plan, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (require === 'admin' && plan !== 'admin') return <Navigate to="/" replace />;
  if (require === 'pro' && plan === 'free') return <Navigate to="/pricing" replace />;
  return <>{children}</>;
}

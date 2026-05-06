import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Zap } from "lucide-react";

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { login } = useAuth();
  const handle = (p: 'delta' | 'google') => { login(p); onOpenChange(false); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to CryptOption</DialogTitle>
          <DialogDescription>
            Mock login — no real broker connection. You'll get ₹10,00,000 virtual capital for paper trading.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Button onClick={() => handle('delta')} className="w-full justify-start bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-12">
            <Zap className="mr-2 h-5 w-5" /> Login with Delta Exchange (Mock)
          </Button>
          <Button onClick={() => handle('google')} variant="outline" className="w-full justify-start h-12">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            Paper trading only · No real orders · Live Delta Exchange India market data
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Legacy shim: dialog now just routes to /auth. Kept for backwards compatibility.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const nav = useNavigate();
  useEffect(() => { if (open) { onOpenChange(false); nav('/auth'); } }, [open, nav, onOpenChange]);
  return null;
}

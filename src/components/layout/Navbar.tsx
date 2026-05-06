import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, TrendingUp, Menu, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/option-chain", label: "Option Chain" },
  { to: "/strategy-builder", label: "Strategy Builder" },
  { to: "/paper-trading", label: "Paper Trading" },
  { to: "/oi-analysis", label: "OI Analysis" },
  { to: "/positions", label: "Positions" },
  { to: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Crypt<span className="text-gradient">Option</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary ${loc.pathname === l.to ? 'text-primary' : 'text-muted-foreground'}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  {user.name} {user.plan === 'pro' && <span className="ml-1 text-xs text-accent">PRO</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => nav('/positions')}>My Positions</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav('/paper-trading')}>Paper Trading</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow" onClick={() => setLogin(true)}>
              Login
            </Button>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border">
          <div className="container py-3 flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <LoginDialog open={login} onOpenChange={setLogin} />
    </header>
  );
}

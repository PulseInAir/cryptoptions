import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-card/30">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary"><TrendingUp className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-bold text-lg">Crypt<span className="text-gradient">Option</span></span>
          </div>
          <p className="text-sm text-muted-foreground">India's largest crypto options trading platform. Paper trading & forward testing only.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/option-chain" className="hover:text-primary">Option Chain</Link></li>
            <li><Link to="/strategy-builder" className="hover:text-primary">Strategy Builder</Link></li>
            <li><Link to="/paper-trading" className="hover:text-primary">Paper Trading</Link></li>
            <li><Link to="/oi-analysis" className="hover:text-primary">OI Analysis</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><a className="hover:text-primary" href="#">About</a></li>
            <li><a className="hover:text-primary" href="#">Blog</a></li>
            <li><a className="hover:text-primary" href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Disclaimer</h4>
          <p className="text-xs text-muted-foreground">CryptOption is an educational paper-trading platform. Market data via Delta Exchange India public APIs. No real orders are placed.</p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CryptOption. Built for traders who think in payoffs.
      </div>
    </footer>
  );
}

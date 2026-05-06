import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";

export function CTA() {
  const [open, setOpen] = useState(false);
  return (
    <section className="container py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 lg:p-16 text-center shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,white,transparent_50%)] opacity-10" />
        <div className="relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground">Ready to trade smarter?</h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">Join thousands of crypto options traders. ₹10,00,000 virtual capital waiting.</p>
          <Button size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90 h-12 px-8" onClick={() => setOpen(true)}>
            Start Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <LoginDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

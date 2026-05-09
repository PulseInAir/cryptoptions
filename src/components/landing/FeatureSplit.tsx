import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: string;
  desc: string;
  cta?: { label: string; to: string };
  visual: ReactNode;
  reverse?: boolean;
}

export function FeatureSplit({ eyebrow, title, desc, cta, visual, reverse }: Props) {
  return (
    <section className="container py-20">
      <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">{eyebrow}</div>
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">{title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{desc}</p>
          {cta && (
            <Link to={cta.to}>
              <Button className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow h-11 px-6">{cta.label}</Button>
            </Link>
          )}
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-primary opacity-10 blur-3xl rounded-full" />
          <div className="relative glass rounded-2xl p-5 shadow-card">{visual}</div>
        </div>
      </div>
    </section>
  );
}
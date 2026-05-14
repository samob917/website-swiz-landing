import Link from "next/link";
import type { CtaLink } from "@/lib/engine/types";

interface Cta1Props {
  heading: string;
  body?: string;
  cta: CtaLink;
}

export function Cta1({ heading, body, cta }: Cta1Props) {
  return (
    <section className="hero-background medical-pattern relative overflow-hidden py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-3xl text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {heading}
          </h2>
          {body && (
            <p className="max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
              {body}
            </p>
          )}
          <Link
            href={cta.href}
            className="btn-smooth group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base px-8 py-3.5 rounded-lg hover:bg-white/20 hover:border-white/40 mt-2 transition-all"
          >
            <span>{cta.label}</span>
            <svg
              className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

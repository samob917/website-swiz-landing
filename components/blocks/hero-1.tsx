import Link from "next/link";
import type { CtaLink, MediaObject } from "@/lib/engine/types";

interface Hero1Props {
  heading: string;
  subheading: string;
  cta: CtaLink;
  secondaryCta?: CtaLink;
  media?: MediaObject;
  heroImage?: string;
}

/** Render `**bold**` segments in hero headings as yellow-accented bold. */
function renderHeading(heading: string) {
  const parts = heading.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <span key={i} className="text-yellow-400">
          {m[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Hero1({
  heading,
  subheading,
  cta,
  secondaryCta,
  media,
  heroImage,
}: Hero1Props) {
  const imageSrc = heroImage ?? media?.src;
  const imageAlt = media?.alt ?? heading.replace(/\*\*/g, "");

  return (
    <section className="hero-background medical-pattern relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 relative z-10">
        {imageSrc ? (
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <h1 className="hero-text hero-text-bold hero-glow text-white text-4xl sm:text-5xl lg:text-6xl">
                {renderHeading(heading)}
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
                {subheading}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <CtaButton cta={cta} primary />
                {secondaryCta && <CtaButton cta={secondaryCta} />}
              </div>
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="hero-text hero-text-bold hero-glow text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 sm:mb-8 max-w-5xl">
              {renderHeading(heading)}
            </h1>
            <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mb-10">
              {subheading}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <CtaButton cta={cta} primary />
              {secondaryCta && <CtaButton cta={secondaryCta} />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CtaButton({ cta, primary }: { cta: CtaLink; primary?: boolean }) {
  return (
    <Link
      href={cta.href}
      className={
        primary
          ? "btn-smooth group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base px-8 py-3.5 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all"
          : "btn-smooth inline-flex items-center gap-3 bg-transparent border border-white/20 text-white/80 font-medium text-base px-8 py-3.5 rounded-lg hover:bg-white/10 hover:text-white transition-all"
      }
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
  );
}

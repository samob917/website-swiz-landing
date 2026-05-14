interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Dark hero band rendered at the top of index/post pages so the absolute
 * white-text Navigation has a legible backdrop. Mirrors the
 * `hero-background medical-pattern` opener used on every other page.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="hero-background medical-pattern relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            {eyebrow}
          </p>
        )}
        <h1 className="hero-text hero-text-bold text-white text-4xl sm:text-5xl lg:text-6xl mb-5 max-w-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

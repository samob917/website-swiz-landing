import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Use the dark hero-background medical-pattern style. */
  dark?: boolean;
}

export function SectionContainer({
  children,
  className,
  dark = false,
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        dark
          ? "hero-background medical-pattern relative overflow-hidden text-white"
          : "bg-white text-gray-900",
        "py-14 sm:py-20",
        className,
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}

import { type LucideIcon, icons, CircleAlert } from "lucide-react";
import { SectionContainer } from "@/components/section-container";

interface PainPoint {
  title: string;
  body: string;
  icon?: string;
  image?: { src: string; alt: string };
}

interface PainAgitation1Props {
  heading: string;
  body?: string;
  painPoints: PainPoint[];
}

function toIconKey(name: string): string {
  return name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function resolveIcon(name: string): LucideIcon {
  const key = toIconKey(name);
  return (icons as Record<string, LucideIcon>)[key] ?? CircleAlert;
}

export function PainAgitation1({
  heading,
  body,
  painPoints,
}: PainAgitation1Props) {
  return (
    <SectionContainer>
      <h2 className="mx-auto mb-4 max-w-2xl text-center text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        {heading}
      </h2>
      {body && (
        <p className="mx-auto mb-14 max-w-2xl text-center text-gray-600 leading-relaxed">
          {body}
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {painPoints.map((p) => {
          const Icon = p.icon ? resolveIcon(p.icon) : null;
          return (
            <div
              key={p.title}
              className="glass-card flex flex-col rounded-2xl p-8"
            >
              {Icon && (
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10">
                  <Icon className="h-5 w-5 text-yellow-500" aria-hidden />
                </div>
              )}
              <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900">
                {p.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{p.body}</p>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

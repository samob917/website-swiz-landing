import { CheckIcon } from "lucide-react";
import { SectionContainer } from "@/components/section-container";

interface FeatureShowcaseItem {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  highlights?: string[];
}

interface FeatureShowcase1Props {
  heading: string;
  description?: string;
  slug?: string;
  featureImageMap?: Record<string, string>;
  items: FeatureShowcaseItem[];
}

export function FeatureShowcase1({
  heading,
  description,
  slug,
  featureImageMap,
  items,
}: FeatureShowcase1Props) {
  return (
    <SectionContainer>
      <h2 className="mx-auto mb-4 max-w-2xl text-center text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        {heading}
      </h2>
      {description && (
        <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
      <div className="flex flex-col gap-16 lg:gap-24">
        {items.map((item, i) => {
          const image = resolveFeatureImage(item, slug, featureImageMap);
          return (
            <div
              key={item.id ?? item.title}
              className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {image && (
                <div className="w-full lg:w-1/2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              )}
              <div className={image ? "w-full lg:w-1/2" : "w-full"}>
                {item.eyebrow && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-yellow-500">
                    {item.eyebrow}
                  </p>
                )}
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                        <span className="text-sm text-gray-700">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

function resolveFeatureImage(
  item: FeatureShowcaseItem,
  slug?: string,
  featureImageMap?: Record<string, string>,
): { src: string; alt: string } | null {
  if (item.image) return item.image;
  if (item.id && featureImageMap?.[item.id]) {
    return { src: featureImageMap[item.id], alt: item.title };
  }
  if (slug && featureImageMap?.[slug]) {
    return { src: featureImageMap[slug], alt: item.title };
  }
  return null;
}

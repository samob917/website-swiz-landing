import type { UsesPageData } from "@/lib/engine/uses-types";
import { Hero1 } from "@/components/blocks/hero-1";
import { PainAgitation1 } from "@/components/blocks/pain-agitation-1";
import { FeatureShowcase1 } from "@/components/blocks/feature-showcase-1";
import { Cta1 } from "@/components/blocks/cta-1";
import { Faq1 } from "@/components/blocks/faq-1";

interface UsesPageContentProps {
  data: UsesPageData;
  featureImageMap?: Record<string, string>;
}

export function UsesPageContent({
  data,
  featureImageMap,
}: UsesPageContentProps) {
  return (
    <>
      <Hero1
        heading={data.hero.title}
        subheading={data.hero.description}
        cta={{
          label: data.cta.buttonText,
          href: "/contact",
          variant: "default",
        }}
      />

      <PainAgitation1
        heading={data.problems.title}
        body={data.problems.description}
        painPoints={data.problems.items.map((item) => ({
          ...item,
          body: item.description,
        }))}
      />

      <FeatureShowcase1
        heading={data.features.title}
        description={data.features.description}
        featureImageMap={featureImageMap}
        items={data.features.items}
      />

      <Faq1 heading="Frequently Asked Questions" items={data.faq} />

      <Cta1
        heading={data.cta.title}
        body={data.cta.description}
        cta={{
          label: data.cta.buttonText,
          href: "/contact",
          variant: "outline",
        }}
      />
    </>
  );
}

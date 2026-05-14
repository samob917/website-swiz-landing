// /uses/[slug] domain model — fixed-section: hero → problems → solution → features → faq → cta

export interface UsesPageData {
  hero: {
    title: string;
    description: string;
  };
  problems: {
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
      icon?: string;
      image?: { src: string; alt: string };
    }[];
  };
  solution: {
    title: string;
    description: string;
  };
  features: {
    title: string;
    description: string;
    items: {
      id: string;
      eyebrow?: string;
      title: string;
      description: string;
      image?: { src: string; alt: string };
      highlights?: string[];
    }[];
  };
  cta: {
    title: string;
    buttonText: string;
    description: string;
  };
  faq: { question: string; answer: string }[];
}

export interface UsesPageJson {
  slug: string;
  anchor: string;
  paragraph: string;
  category: string;
  data: UsesPageData;
  seoMetadata: {
    h1: string;
    h1Paragraph: string;
    metaTitle: string;
    metaDescription: string;
  };
}

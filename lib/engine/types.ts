// Site-level config types — shared across blog/uses/feature pages.

export interface SitemapHints {
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export interface MediaObject {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  width?: number;
  height?: number;
}

export interface CtaLink {
  label: string;
  href: string;
  variant?: "default" | "outline" | "ghost";
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface GlobalSeo {
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  jsonLd: Record<string, unknown>[];
}

export interface NavbarConfig {
  logo: MediaObject;
  items?: NavItem[];
  left?: NavItem[];
  center?: NavItem[];
  right?: NavItem[];
  cta?: CtaLink;
}

export interface FooterConfig {
  columns: {
    heading: string;
    headingHref?: string;
    links: { label: string; href: string }[];
  }[];
  legal?: {
    copyright: string;
    links: { label: string; href: string }[];
  };
}

export interface BlogConfig {
  seo: {
    title: string;
    titleTemplate?: string;
    description: string;
  };
  heading: string;
  subtitle: string;
  highlightedTags?: {
    label: string;
    value: string;
    description: string;
  }[];
  sitemap?: SitemapHints;
}

export interface UsesIndexConfig {
  seo: { title: string; description: string };
  heading: string;
  description: string;
  categoryLabels: Record<string, string>;
  sitemap?: SitemapHints;
}

export interface SiteConfig {
  name: string;
  domain: string;
  globalSeo: GlobalSeo;
  navbar: NavbarConfig;
  footer: FooterConfig;
  blog?: BlogConfig;
  usesIndex?: UsesIndexConfig;
  featureImageMap?: Record<string, string>;
}

import { z } from "zod";

const sitemapHintsSchema = z.object({
  priority: z.number(),
  changeFrequency: z.enum([
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ]),
});

const mediaObjectSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string(),
  alt: z.string().optional(),
  poster: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const ctaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["default", "outline", "ghost"]).optional(),
});

const baseNavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

type NavItemType = z.infer<typeof baseNavItemSchema> & {
  children?: NavItemType[];
};

const navItemSchema: z.ZodType<NavItemType> = baseNavItemSchema.extend({
  children: z.lazy(() => navItemSchema.array()).optional(),
}) as z.ZodType<NavItemType>;

const globalSeoSchema = z.object({
  titleTemplate: z.string(),
  defaultDescription: z.string(),
  ogImage: z.string(),
  jsonLd: z.array(z.record(z.string(), z.unknown())),
});

const navbarConfigSchema = z.object({
  logo: mediaObjectSchema,
  items: z.array(navItemSchema).optional(),
  left: z.array(navItemSchema).optional(),
  center: z.array(navItemSchema).optional(),
  right: z.array(navItemSchema).optional(),
  cta: ctaLinkSchema.optional(),
});

const footerConfigSchema = z.object({
  columns: z.array(
    z.object({
      heading: z.string(),
      headingHref: z.string().optional(),
      links: z.array(z.object({ label: z.string(), href: z.string() })),
    }),
  ),
  legal: z
    .object({
      copyright: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })),
    })
    .optional(),
});

const blogConfigSchema = z.object({
  seo: z.object({
    title: z.string(),
    titleTemplate: z.string().optional(),
    description: z.string(),
  }),
  heading: z.string(),
  subtitle: z.string(),
  highlightedTags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
  sitemap: sitemapHintsSchema.optional(),
});

const usesIndexConfigSchema = z.object({
  seo: z.object({ title: z.string(), description: z.string() }),
  heading: z.string(),
  description: z.string(),
  categoryLabels: z.record(z.string(), z.string()),
  sitemap: sitemapHintsSchema.optional(),
});

export const siteConfigSchema = z.object({
  name: z.string(),
  domain: z.string(),
  globalSeo: globalSeoSchema,
  navbar: navbarConfigSchema,
  footer: footerConfigSchema,
  blog: blogConfigSchema.optional(),
  usesIndex: usesIndexConfigSchema.optional(),
  featureImageMap: z.record(z.string(), z.string()).optional(),
});

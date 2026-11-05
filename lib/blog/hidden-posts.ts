// Slugs of blog posts to hide from the site without unpublishing them in Wisp CMS.
// Hidden posts are filtered out of the /blog listing and return 404 on their detail page.
export const HIDDEN_POST_SLUGS = new Set<string>([
  // "specialty-hour-rules-acgme" was hidden in July 2026; it has since been fact-checked and rewritten and five posts link to it.
]);

export const isHiddenPost = (slug: string) => HIDDEN_POST_SLUGS.has(slug);

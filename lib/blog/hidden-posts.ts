// Slugs of blog posts to hide from the site without unpublishing them in Wisp CMS.
// Hidden posts are filtered out of the /blog listing and return 404 on their detail page.
export const HIDDEN_POST_SLUGS = new Set<string>([
  // specialty-hour-rules-acgme is held back with publish:false (overlapped the six-rules post) and redirects there.
]);

export const isHiddenPost = (slug: string) => HIDDEN_POST_SLUGS.has(slug);

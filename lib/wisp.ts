import {
  buildWispClient,
  type GetPostsResult,
  type GetPostResult,
} from "@wisp-cms/client";

// Public Wisp blog ID — not a secret, safe to hardcode.
export const wisp = buildWispClient({
  blogId: "bbc13e17-9b91-4e21-8216-6a3827bb0701",
});

export type { GetPostsResult, GetPostResult };

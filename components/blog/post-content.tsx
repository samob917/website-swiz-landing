"use client";

import { generateTableOfContents } from "@/lib/blog/table-of-contents";
import sanitize, { defaults } from "sanitize-html";
import { TableOfContents } from "./table-of-contents";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The FAQ at the end of a post renders as a list of closed questions, the way the use pages'
 * FAQ does, instead of every answer open on the page. Each <h3> after the "Frequently Asked
 * Questions" heading becomes a <details> with the question as its <summary>, up to the next
 * <h2>. Heading ids from the table of contents are kept, and a browser opens the matching
 * <details> when a link targets a heading inside it.
 */
function collapseFaq(html: string): string {
  const open = html.match(/<h2[^>]*>\s*Frequently Asked Questions\s*<\/h2>/i);
  if (!open || open.index === undefined) return html;
  const start = open.index + open[0].length;
  const nextH2 = html.slice(start).search(/<h2[\s>]/i);
  const end = nextH2 === -1 ? html.length : start + nextH2;
  const section = html.slice(start, end);
  const parts = section.split(/(?=<h3[\s>])/i);
  if (parts.length < 2) return html;
  const lead = parts[0];
  const items = parts
    .slice(1)
    .map((chunk) => {
      const m = chunk.match(/^<h3([^>]*)>([\s\S]*?)<\/h3>([\s\S]*)$/i);
      if (!m) return chunk;
      return `<details class="post-faq"><summary><h3${m[1]}>${m[2]}</h3></summary><div class="post-faq-body">${m[3]}</div></details>`;
    })
    .join("");
  return `${html.slice(0, start)}${lead}<div class="post-faq-list">${items}</div>${html.slice(end)}`;
}

export function PostContent({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  const sanitizedContent = sanitize(content, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "code",
      "pre",
      "p",
      "li",
      "ul",
      "ol",
      "blockquote",
      "td",
      "th",
      "table",
      "tr",
      "tbody",
      "thead",
      "tfoot",
      "small",
      "div",
      "iframe",
      "span",
      "br",
    ],
    allowedAttributes: {
      ...defaults.allowedAttributes,
      "*": ["style", "class", "id"],
      iframe: ["src", "allowfullscreen", "style"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
  });

  const { modifiedHtml: tocHtml, tableOfContents } =
    generateTableOfContents(sanitizedContent);
  const modifiedHtml = collapseFaq(tocHtml);

  // Read the URL after mount so the server and client render the same markup.
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="prose prose-lg max-w-none break-words prose-headings:font-bold prose-headings:tracking-tight prose-a:text-yellow-600 hover:prose-a:text-yellow-700">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: modifiedHtml }} />
        </div>
      </div>

      {tableOfContents.length > 0 && (
        <div className="lg:col-span-4">
          <div className="mb-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <Separator className="mb-4 lg:hidden" />
            <div className="hidden lg:block">
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                On this page
              </div>
              <TableOfContents items={tableOfContents} />
            </div>

            <Separator className="my-8 hidden lg:block" />

            <div className="my-8">
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Share this article
              </div>
              <ul className="flex gap-2">
                <li>
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </li>
              </ul>
            </div>

            <Separator className="my-8 hidden lg:block" />

            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 hover:underline"
              >
                &larr; Back to all posts
              </Link>
            </div>

            <Separator className="my-8 lg:hidden" />
          </div>
        </div>
      )}
    </div>
  );
}

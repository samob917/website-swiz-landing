"use client";

import { ContentWithCustomComponents } from "@wisp-cms/react-custom-component";
import { generateTableOfContents } from "@wisp-cms/table-of-content";
import sanitize, { defaults } from "sanitize-html";
import { TableOfContents } from "./table-of-contents";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

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
    ],
    allowedAttributes: {
      ...defaults.allowedAttributes,
      "*": ["style", "class", "id"],
      iframe: ["src", "allowfullscreen", "style"],
      div: [
        "data-name",
        "data-wisp-react-component",
        "data-version",
        "data-props",
      ],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
  });

  const { modifiedHtml, tableOfContents } =
    generateTableOfContents(sanitizedContent);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="prose prose-lg max-w-none break-words prose-headings:font-bold prose-headings:tracking-tight prose-a:text-yellow-600 hover:prose-a:text-yellow-700">
          <ContentWithCustomComponents
            content={modifiedHtml}
            customComponents={{}}
          />
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

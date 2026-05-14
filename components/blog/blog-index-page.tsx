"use client";

import { wisp } from "@/lib/wisp";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { BlogConfig } from "@/lib/engine/types";
import { SectionContainer } from "@/components/section-container";
import type { GetPostsResult } from "@wisp-cms/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface GetPostsParams {
  page: number;
  limit: number;
  tags?: string[];
}

const POSTS_PER_PAGE = 12;

const DEFAULT_HIGHLIGHTED_TAGS = [
  {
    label: "Featured",
    value: "featured",
    description: "Featured articles from the blog.",
  },
];

interface BlogIndexPageProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
  blogConfig?: BlogConfig;
  /** When true, suppress the heading + subtitle (because a parent PageHeader is rendering them). */
  hideHeading?: boolean;
}

export const BlogIndexPage = ({
  searchParams,
  blogConfig,
  hideHeading = false,
}: BlogIndexPageProps) => {
  const router = useRouter();
  const params = use(searchParams);
  const highlightedTags =
    blogConfig?.highlightedTags ?? DEFAULT_HIGHLIGHTED_TAGS;

  const [posts, setPosts] = useState<GetPostsResult["posts"]>([]);
  const [pagination, setPagination] = useState<GetPostsResult["pagination"]>({
    page: 1,
    limit: POSTS_PER_PAGE,
    totalPages: 0,
    totalPosts: 0,
    nextPage: 1,
    prevPage: 1,
  });
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const fetchPosts = async (page: number, tag: string | null) => {
    setLoading(true);
    try {
      const fetchParams: GetPostsParams = { page, limit: POSTS_PER_PAGE };
      if (tag) fetchParams.tags = [tag];
      const result = await wisp.getPosts(fetchParams);
      setPosts(result.posts);
      setPagination(result.pagination);
      setCurrentPage(page);
      setCurrentTag(tag);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (tag: string | null, page: number) => {
    const urlParams = new URLSearchParams();
    if (tag) urlParams.set("tag", tag);
    if (page > 1) urlParams.set("page", page.toString());
    const qs = urlParams.toString();
    router.push(qs ? `/blog?${qs}` : "/blog", { scroll: false });
  };

  const handleTagChange = (tag: string | null) => {
    if (tag !== currentTag) {
      setCurrentPage(1);
      fetchPosts(1, tag);
      updateURL(tag, 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchPosts(page, currentTag);
      updateURL(currentTag, page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const tag = params.tag || null;
    const page = Math.max(1, parseInt(params.page || "1"));
    fetchPosts(page, tag);
  }, [params.tag, params.page]);

  return (
    <SectionContainer>
      {!hideHeading && (
        <>
          <h1 className="mb-4 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            {currentTag
              ? highlightedTags.find((t) => t.value === currentTag)?.label ||
                `Posts tagged '${currentTag}'`
              : (blogConfig?.heading ?? "Blog")}
          </h1>
          <p className="text-gray-600 mb-12 max-w-2xl text-lg leading-relaxed">
            {currentTag
              ? highlightedTags.find((t) => t.value === currentTag)
                  ?.description || "Browse posts by tag."
              : (blogConfig?.subtitle ??
                "Insights, updates, and stories from our team.")}
          </p>
        </>
      )}

      {/* Filter */}
      <div className="mb-10 border-b border-gray-200 pb-2">
        <div className="flex flex-wrap items-center gap-8">
          <button
            onClick={() => handleTagChange(null)}
            className={`pb-3 text-sm font-medium transition-colors ${
              currentTag === null
                ? "text-gray-900 border-b-2 border-yellow-400 -mb-[1px]"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Latest
          </button>
          {highlightedTags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagChange(tag.value)}
              className={`pb-3 text-sm font-medium transition-colors ${
                currentTag === tag.value
                  ? "text-gray-900 border-b-2 border-yellow-400 -mb-[1px]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-yellow-400 border-b-transparent" />
          <p className="text-gray-500 mt-3 text-sm">Loading posts...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid gap-x-4 gap-y-10 md:grid-cols-2 lg:gap-x-6 lg:gap-y-12 2xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col">
                <Link
                  href={`/blog/${post.slug}`}
                  className="mb-4 overflow-hidden rounded-xl bg-gray-100"
                >
                  <AspectRatio ratio={16 / 9}>
                    {post.image ? (
                      <Image
                        alt={post.title}
                        src={post.image}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </AspectRatio>
                </Link>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/blog?tag=${tag.name}`}>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mb-2 line-clamp-3 text-xl md:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-yellow-600 transition-colors"
                >
                  {post.title}
                </Link>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gray-600 line-clamp-3 text-sm md:text-base leading-relaxed"
                >
                  {post.description}
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500 text-base">
                {currentTag
                  ? `No posts found with tag "${currentTag}".`
                  : "No posts published yet — check back soon."}
              </p>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent className="flex-wrap">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {(() => {
                  const items: React.ReactNode[] = [];
                  const totalPages = pagination.totalPages;
                  const current = currentPage;
                  const maxVisible = isMobile ? 3 : 5;
                  const sidePages = Math.floor((maxVisible - 1) / 2);

                  items.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={1 === current}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>,
                  );

                  let start = Math.max(2, current - sidePages);
                  let end = Math.min(totalPages - 1, current + sidePages);
                  if (current <= sidePages + 1) {
                    end = Math.min(totalPages - 1, maxVisible - 1);
                  } else if (current >= totalPages - sidePages) {
                    start = Math.max(2, totalPages - maxVisible + 2);
                  }

                  if (start > 2) {
                    items.push(
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>,
                    );
                  }

                  for (let page = start; page <= end; page++) {
                    items.push(
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === current}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                  }

                  if (end < totalPages - 1) {
                    items.push(
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>,
                    );
                  }

                  if (totalPages > 1) {
                    items.push(
                      <PaginationItem key={totalPages}>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                          isActive={totalPages === current}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                  }

                  return items;
                })()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage >= pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </SectionContainer>
  );
};

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

import ex1Image from "@/assets/ex1.jpeg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getArticles, type Article } from "@/lib/articles";
import { CommunityCtaSection } from "../sections/CommunityCtaSection";

function formatArticleDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function resolveArticleImage(imageUrl: string | null) {
  if (!imageUrl || imageUrl === "/src/assets/ex1.jpeg") {
    return ex1Image;
  }

  return imageUrl;
}

export function BlogPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });
  const blogPosts: Article[] = data ?? [];

  return (
    <main>
      <div className="min-h-screen bg-black px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1560px]">
          <header className="mx-auto w-full text-center">
            <h1 className="font-display text-3xl font-regular leading-[1.2] tracking-normal text-white sm:text-7xl lg:text-6xl">
              Don&apos;t miss what&apos;s new <br /> at PXDL
            </h1>
          </header>

          <div className="mt-20 flex items-center justify-between gap-6">
            <p className="text-sm font-light text-white/45">
              Showing {blogPosts.length} results out of {blogPosts.length}
            </p>

            <Select defaultValue="recent">
              <SelectTrigger className="h-10 w-40 rounded-none border-white/20 bg-transparent text-sm font-light text-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="mt-12 flex min-h-80 items-center justify-center text-white/60">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading articles...
            </div>
          ) : isError ? (
            <div className="mt-12 flex min-h-80 flex-col items-center justify-center bg-white/5 px-6 text-center">
              <Newspaper className="size-10 text-white/35" />
              <h2 className="mt-5 text-xl font-light text-white">
                Articles are not available.
              </h2>
              <p className="mt-3 max-w-md text-sm font-light leading-6 text-white/50">
                We could not load the blog articles right now. Please check back later.
              </p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="mt-12 flex min-h-80 flex-col items-center justify-center bg-white/5 px-6 text-center">
              <Newspaper className="size-10 text-white/35" />
              <h2 className="mt-5 text-xl font-light text-white">
                No articles yet.
              </h2>
              <p className="mt-3 max-w-md text-sm font-light leading-6 text-white/50">
                Blog articles are not available yet. Please check back later.
              </p>
            </div>
          ) : (
            <section className="mt-12 grid gap-3 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex min-h-full flex-col border border-transparent"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    aria-label={post.title}
                    className="relative block aspect-[1.5] overflow-hidden"
                  >
                    <img
                      src={resolveArticleImage(post.image_url)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(0,0,0,0.14))]" />
                  </Link>

                  <div className="pt-5">
                    <p className="text-xs font-light text-white/45">
                      {formatArticleDate(post.published_at)}
                    </p>
                    <h2 className="mt-3 text-lg font-light leading-snug text-white">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm font-light leading-6 text-white/60">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-light text-white transition-colors hover:text-white/70"
                    >
                      Read more
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </div>

      <CommunityCtaSection />
    </main>
  );
}

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getArticles, type Article } from "@/lib/articles";

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

export function ArticlesSection() {
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });
  const latestArticles = useMemo(
    () =>
      [...(data ?? [])].sort((first, second) => {
      const firstDate = first.published_at
        ? new Date(first.published_at).getTime()
        : 0;
      const secondDate = second.published_at
        ? new Date(second.published_at).getTime()
        : 0;

      return secondDate - firstDate;
      }),
    [data],
  );
  const desktopArticles = latestArticles.slice(0, 3);
  const mobileArticles = latestArticles.slice(0, 5);
  const activeMobileArticle = mobileArticles[activeArticleIndex];

  useEffect(() => {
    setActiveArticleIndex(0);
  }, [mobileArticles.length]);

  useEffect(() => {
    if (mobileArticles.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveArticleIndex((current) => (current + 1) % mobileArticles.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [mobileArticles.length]);

  return (
    <section className="bg-black px-3 pb-8 pt-10 text-white sm:px-5 sm:py-14">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-8">
        <div className="px-1 sm:px-0">
          <p className="text-xs font-light uppercase tracking-normal text-white/55">
            Latest Articles
          </p>

          <div className="mt-5 flex items-center justify-between gap-5">
            <h2 className="font-display text-balance text-4xl font-normal leading-[0.95] tracking-normal sm:text-7xl lg:text-5xl">
              The latest
            </h2>

            <Link
              to="/blog"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-[#07503d] px-4 text-sm font-light text-white shadow-none transition-colors hover:bg-[#07503d]/95"
            >
              View all
            </Link>
          </div>
        </div>

        {latestArticles.length > 0 ? (
          <>
            {activeMobileArticle && (
              <div className="sm:hidden">
                <ArticleCard article={activeMobileArticle} />
                {mobileArticles.length > 1 && (
                  <div className="mt-5 flex items-center justify-center gap-3">
                    {mobileArticles.map((article, index) => (
                      <button
                        key={article.id}
                        type="button"
                        className={`rounded-full bg-white transition-all ${
                          index === activeArticleIndex
                            ? "size-1.5 opacity-100"
                            : "size-1.5 opacity-35"
                        }`}
                        aria-label={`Show article ${index + 1}`}
                        aria-current={
                          index === activeArticleIndex ? "true" : undefined
                        }
                        onClick={() => setActiveArticleIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="hidden gap-3 sm:grid lg:grid-cols-3">
              {desktopArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-60 items-center justify-center bg-white/5 px-6 text-center text-sm font-light text-white/55">
            No articles are available yet.
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCard({
  article,
}: {
  article: Article;
}) {
  return (
    <article className="group min-h-full">
      <Link
        to={`/blog/${article.slug}`}
        aria-label={article.title}
        className="relative block aspect-[1.5] overflow-hidden"
      >
        {article.image_url ? (
          <img
            src={article.image_url}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="size-full bg-white/8" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(0,0,0,0.16))]" />
      </Link>

      <div className="pt-5">
        <p className="text-xs font-light text-white/45">
          {formatArticleDate(article.published_at)}
        </p>
        <h3 className="mt-3 text-lg font-light leading-snug text-white">
          <Link to={`/blog/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.excerpt && (
          <p className="mt-2 text-sm font-light leading-6 text-white/60">
            {article.excerpt}
          </p>
        )}
        <Link
          to={`/blog/${article.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-light text-white transition-colors hover:text-white/70"
        >
          Read more
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import ex1Image from "@/assets/ex1.jpeg";
import { getArticle } from "@/lib/articles";
import { CommunityCtaSection } from "@/pages/website/sections/CommunityCtaSection";

function formatArticleDate(value: string | null | undefined) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function resolveArticleImage(imageUrl: string | null | undefined) {
  if (!imageUrl || imageUrl === "/src/assets/ex1.jpeg") {
    return ex1Image;
  }

  return imageUrl;
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={`${match.index}-strong`} className="font-normal text-white">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      nodes.push(
        <em key={`${match.index}-em`} className="italic text-white/85">
          {match[3]}
        </em>,
      );
    } else if (match[4] && match[5]) {
      nodes.push(
        <a
          key={`${match.index}-link`}
          href={match[5]}
          className="text-white underline underline-offset-4 transition-colors hover:text-white/70"
          target="_blank"
          rel="noreferrer"
        >
          {match[4]}
        </a>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderArticleContent(content: string) {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className="space-y-7 text-base font-light leading-8 text-white/72 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[#07503d] [&_blockquote]:pl-5 [&_blockquote]:text-lg [&_blockquote]:text-white/78 [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:text-white [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-normal [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="mt-10 text-3xl font-normal leading-tight text-white first:mt-0"
        >
          {renderInlineMarkdown(block.replace(/^##\s+/, ""))}
        </h2>
      );
    }

    if (block.startsWith("> ")) {
      return (
        <blockquote
          key={index}
          className="mt-8 border-l-2 border-[#07503d] pl-5 text-lg font-light leading-8 text-white/78 first:mt-0"
        >
          {renderInlineMarkdown(block.replace(/^>\s?/gm, ""))}
        </blockquote>
      );
    }

    const lines = block.split("\n");
    const isBulletList = lines.every((line) => /^-\s+/.test(line));
    const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line));

    if (isBulletList) {
      return (
        <ul
          key={index}
          className="mt-7 list-disc space-y-2 pl-5 text-base font-light leading-8 text-white/72 first:mt-0"
        >
          {lines.map((line) => (
            <li key={line}>{renderInlineMarkdown(line.replace(/^-\s+/, ""))}</li>
          ))}
        </ul>
      );
    }

    if (isNumberedList) {
      return (
        <ol
          key={index}
          className="mt-7 list-decimal space-y-2 pl-5 text-base font-light leading-8 text-white/72 first:mt-0"
        >
          {lines.map((line) => (
            <li key={line}>
              {renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p
        key={index}
        className="mt-7 text-base font-light leading-8 text-white/72 first:mt-0"
      >
        {renderInlineMarkdown(block)}
      </p>
    );
  });
}

export function BlogDetailPage() {
  const { slug = "" } = useParams();
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticle(slug),
    enabled: Boolean(slug),
  });

  return (
    <main>
      <article className="min-h-screen bg-black px-5 pb-10 pt-16 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-light text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>

          {isLoading && (
            <p className="mt-20 text-sm font-light text-white/60">
              Loading article...
            </p>
          )}

          {isError && !isLoading && (
            <p className="mt-20 text-sm font-light text-white/60">
              Article is not available.
            </p>
          )}

          {article && (
            <>
              <header className="mt-10 sm:mt-14">
                <p className="text-sm font-light text-white/45">
                  {formatArticleDate(article.published_at)}
                </p>
                <h1 className="font-display mt-5 text-3xl font-normal lg:leading-[1.05] leading-11 tracking-normal sm:text-5xl">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="mt-7 max-w-2xl text-base font-light leading-7 text-white/65">
                    {article.excerpt}
                  </p>
                )}
              </header>

              <div className="mt-12 aspect-[1.7] overflow-hidden">
                <img
                  src={resolveArticleImage(article.image_url)}
                  alt=""
                  className="size-full object-cover"
                />
              </div>

              {article.content && (
                <div className="mt-12 max-w-none">
                  {renderArticleContent(article.content)}
                </div>
              )}
            </>
            )}
        </div>
      </article>

      <CommunityCtaSection />
    </main>
  );
}

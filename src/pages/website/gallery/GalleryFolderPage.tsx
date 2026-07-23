import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getGalleryFolder, type GalleryFolder, type GalleryImage } from "@/lib/gallery";
import { cn } from "@/lib/utils";

const initialVisibleImages = 18;
const visibleImageBatchSize = 18;

function imageClassName(image: GalleryImage, index: number) {
  const portrait = image.orientation === "portrait" || index % 7 === 3;
  const square = image.orientation === "square" || index % 9 === 4;

  return cn(
    "mb-3 w-full break-inside-avoid overflow-hidden bg-white/8",
    portrait ? "aspect-[0.72]" : square ? "aspect-square" : "aspect-[1.45]",
  );
}

export function GalleryFolderPage() {
  const { slug = "" } = useParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleImageCount, setVisibleImageCount] = useState(initialVisibleImages);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gallery-folder", slug],
    queryFn: () => getGalleryFolder(slug),
    enabled: Boolean(slug),
  });
  const folder: GalleryFolder | undefined = data;
  const images = folder?.images ?? [];
  const visibleImages = useMemo(
    () => images.slice(0, visibleImageCount),
    [images, visibleImageCount],
  );
  const hasMoreImages = visibleImageCount < images.length;

  useEffect(() => {
    setVisibleImageCount(initialVisibleImages);
  }, [slug]);

  useEffect(() => {
    if (!hasMoreImages) {
      return;
    }

    const sentinel = loadMoreRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setVisibleImageCount((currentCount) =>
          Math.min(currentCount + visibleImageBatchSize, images.length),
        );
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMoreImages, images.length]);

  return (
    <main className="min-h-screen bg-black px-5 pb-16 pt-16 text-white sm:px-8 sm:pb-20 sm:pt-28 lg:px-12">
      <div className="mx-auto w-full max-w-[1560px]">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-sm font-light text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to gallery
        </Link>

        <header className="mt-10 grid gap-6 border-b border-white/10 pb-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-light uppercase tracking-normal text-white/45">
              Gallery Folder
            </p>
            <h1 className="font-display mt-5 text-balance text-5xl font-normal lg:leading-[0.95] tracking-normal sm:text-7xl lg:text-4xl">
              {folder?.title ?? "PXDL Gallery"}
            </h1>
            {folder?.description && (
              <p className="mt-6 max-w-3xl text-sm font-light leading-7 text-white/60">
                {folder.description}
              </p>
            )}
          </div>
          <p className="text-sm font-light text-white/45">
            {images.length} photos
          </p>
        </header>

        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center text-white/60">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading photos...
          </div>
        ) : isError ? (
          <div className="mt-10 flex min-h-96 flex-col items-center justify-center bg-white/5 px-6 text-center">
            <ImageIcon className="size-10 text-white/35" />
            <h2 className="mt-5 text-xl font-light text-white">
              Gallery folder is not available.
            </h2>
            <p className="mt-3 max-w-md text-sm font-light leading-6 text-white/50">
              This folder cannot be opened right now, or its gallery data is not available.
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="mt-10 flex min-h-96 flex-col items-center justify-center bg-white/5 px-6 text-center">
            <ImageIcon className="size-10 text-white/35" />
            <h2 className="mt-5 text-xl font-light text-white">
              No photos in this folder yet.
            </h2>
            <p className="mt-3 max-w-md text-sm font-light leading-6 text-white/50">
              Photos for this gallery are not available yet. Please check back later.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-10 columns-1 gap-3 sm:columns-2 lg:columns-3">
              {visibleImages.map((image, index) => (
                <figure key={image.id} className={imageClassName(image, index)}>
                  {image.image_url ? (
                    <img
                      src={image.image_url}
                      alt={image.title ?? ""}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-9 text-white/40" />
                    </div>
                  )}
                </figure>
              ))}
            </section>

            <div ref={loadMoreRef} className="flex min-h-20 items-center justify-center pt-8">
              {hasMoreImages ? (
                <span className="inline-flex items-center gap-2 text-sm font-light text-white/50">
                  <Loader2 className="size-4 animate-spin" />
                  Loading more photos...
                </span>
              ) : (
                images.length > initialVisibleImages && (
                  <span className="text-sm font-light text-white/35">
                    All photos loaded
                  </span>
                )
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

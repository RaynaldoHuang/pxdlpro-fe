import { useQuery } from "@tanstack/react-query";
import { ImageIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { getGalleryFolders } from "@/lib/gallery";
import { cn } from "@/lib/utils";

const folderSpanClasses = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2",
  "",
];

export function GalleryPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gallery-folders"],
    queryFn: getGalleryFolders,
  });
  const folders = data ?? [];

  return (
    <main className="bg-black text-white">
      <section className="px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:px-12">
        <div className="mx-auto w-full max-w-[1560px]">
          <header className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-3xl font-normal leading-[0.95] tracking-normal sm:text-7xl lg:text-6xl">
              PXDL Photo Galleries
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-sm font-light lg:leading-7 text-white/60 sm:text-sm">
              Explore PXDL moments by folder, from tournaments and player
              sessions to community events across the region.
            </p>
          </header>

          {isLoading ? (
            <div className="mt-20 flex min-h-80 items-center justify-center text-white/60">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading galleries...
            </div>
          ) : isError ? (
            <div className="mt-20 flex min-h-80 flex-col items-center justify-center bg-white/5 px-6 text-center">
              <ImageIcon className="size-10 text-white/35" />
              <h2 className="mt-5 text-xl font-light text-white">
                Gallery is not available.
              </h2>
              <p className="mt-3 max-w-md text-sm font-light leading-6 text-white/50">
                We could not load the gallery right now. Please check back later.
              </p>
            </div>
          ) : folders.length === 0 ? (
            <div className="mt-20 flex min-h-80 flex-col items-center justify-center bg-white/5 px-6 text-center">
              <ImageIcon className="size-10 text-white/35" />
              <h2 className="mt-5 text-xl font-light text-white">
                No gallery folders yet.
              </h2>
              <p className="mt-3 max-w-md text-sm font-light leading-6 text-white/50">
                Gallery folders are not available yet. Please check back later.
              </p>
            </div>
          ) : (
            <div className="mt-20 grid auto-rows-[210px] grid-cols-1 gap-3 sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-cols-3">
              {folders.map((folder, index) => (
                <Link
                  key={folder.id}
                  to={`/gallery/${folder.slug}`}
                  className={cn(
                    "group relative isolate overflow-hidden bg-white/8",
                    folderSpanClasses[index % folderSpanClasses.length],
                  )}
                >
                  {folder.cover_image_url ? (
                    <img
                      src={folder.cover_image_url}
                      alt=""
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-white/8">
                      <ImageIcon className="size-10 text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.42)_55%,rgba(0,0,0,0.68)_100%)]" />
                  <div className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 flex-col items-center text-center sm:inset-x-8">
                    <h2 className="max-w-md text-balance text-lg font-semibold uppercase leading-tight text-white sm:text-2xl">
                      {folder.title}
                    </h2>
                    <p className="mt-5 text-xs font-light uppercase tracking-normal text-white/55">
                      {folder.images_count ?? folder.images?.length ?? 0} photos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

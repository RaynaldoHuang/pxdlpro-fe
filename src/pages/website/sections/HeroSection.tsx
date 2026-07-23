import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import heroVideo from "@/assets/video/bgvid.webm";
import { Button } from "@/components/ui/button";
import { defaultHeroSlide, getHeroSlides } from "@/lib/heroSlides";
import { cn } from "@/lib/utils";
import { routes } from "@/routes/paths";

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: getHeroSlides,
  });

  const slides = useMemo(() => {
    const activeSlides = data?.filter((slide) => slide.is_active) ?? [];

    return activeSlides.length > 0 ? activeSlides : [defaultHeroSlide];
  }, [data]);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const ctaUrl = activeSlide.cta_url || routes.administrator.dashboard;
  const isExternalCta = /^https?:\/\//.test(ctaUrl);
  const titleSize = activeSlide.title_size ?? 96;
  const mobileTitleSize = Math.max(42, Math.round(titleSize * 0.55));

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative isolate flex min-h-[calc(100vh-4.5rem)] overflow-hidden bg-[#050505] px-5 py-16 text-white sm:px-8 lg:px-12">
      {activeSlide.background_type === "image" && activeSlide.background_url ? (
        <img
          className="absolute -inset-x-px -top-px -bottom-2 -z-30 h-[calc(100%+0.625rem)] w-[calc(100%+2px)] object-cover opacity-75 transition-opacity duration-700"
          src={activeSlide.background_url}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <video
          className="absolute -inset-x-px -top-px -bottom-2 -z-30 h-[calc(100%+0.625rem)] w-[calc(100%+2px)] object-cover opacity-75 transition-opacity duration-700"
          src={activeSlide.background_url || heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="absolute -inset-x-px -top-px -bottom-2 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.58)_44%,rgba(3,3,3,0.9)_100%)]" />
      <div className="absolute -inset-x-px -top-px -bottom-2 -z-10 opacity-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-size-[86px_86px]" />
      <div className="absolute -inset-x-px -bottom-2 -z-10 h-[calc(50%+0.5rem)] bg-[linear-gradient(180deg,transparent_0%,rgba(7,80,61,0.18)_100%)]" />

      <div className="mx-auto flex w-full max-w-[1560px] items-center justify-center">
        <div className="relative w-full pt-10 text-center lg:pt-20">
          {activeSlide.eyebrow && (
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-white/70">
              {activeSlide.eyebrow}
            </p>
          )}
          <h1
            className="font-display mx-auto max-w-272 font-medium leading-[1.2] tracking-normal text-white"
            style={{
              fontSize: `clamp(${mobileTitleSize}px, 8vw, ${titleSize}px)`,
            }}
          >
            {activeSlide.title}
          </h1>
          {activeSlide.subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-6 text-white/76 sm:text-lg sm:leading-7">
              {activeSlide.subtitle}
            </p>
          )}

          <div className="relative mx-auto mt-8 flex min-h-40 w-full max-w-3xl flex-col items-center gap-8 sm:mt-10">
            {activeSlide.cta_label && (
              <Button
                asChild
                className="relative z-10 h-10 rounded-md bg-white/10 px-5 text-sm font-light text-white shadow-none backdrop-blur-sm hover:bg-white/15"
              >
                {isExternalCta ? (
                  <a href={ctaUrl}>{activeSlide.cta_label}</a>
                ) : (
                  <Link to={ctaUrl}>{activeSlide.cta_label}</Link>
                )}
              </Button>
            )}

            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id || `${slide.title}-${index}`}
                    type="button"
                    className={cn(
                      "size-2 rounded-full bg-white/40 transition-all hover:bg-white/75",
                      index === activeIndex && "w-7 bg-white",
                    )}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show hero slide ${index + 1}`}
                    aria-pressed={index === activeIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

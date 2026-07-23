import { ArrowRight, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { routes } from "@/routes/paths";

import logo from "@/assets/logo.webp";

const websiteNavigationItems = [
  {
    title: "Ranking",
    href: routes.website.rankings,
    children: [
      {
        title: "System & Points Breakdown",
        href: routes.website.systemPointsBreakdown,
      },
      {
        title: "PXDL Elite",
        href: "/#pxdl-elite",
      },
      {
        title: "PXDL Squad",
        href: "/#pxdl-squad",
      },
      {
        title: "PXDL Member",
        href: "/#pxdl-member",
      },
    ],
  },
  {
    title: "Events",
    href: routes.website.events,
  },
  {
    title: "About Us",
    href: "/#customers",
  },
  {
    title: "Blog",
    href: routes.website.blog,
  },
  {
    title: "Gallery",
    href: routes.website.gallery,
  },
];

const rankingMenuItems = [
  {
    title: "PXDL Elite",
    description: "Top competitive ranking for elite padel players",
    href: "/#pxdl-elite",
    tags: ["Leaderboard", "Tournament"],
  },
  {
    title: "PXDL Squad",
    description: "Team-based ranking for active clubs and squads",
    href: "/#pxdl-squad",
    tags: ["Teams", "Clubs"],
  },
  {
    title: "PXDL Member",
    description: "Member ranking for the wider PXDL community",
    href: "/#pxdl-member",
    tags: ["Community", "Member"],
  },
];

function BrandLink() {
  return (
    <Link to={routes.website.home} className="inline-flex items-center">
      <img
        src={logo}
        alt={`${siteConfig.name} logo`}
        className="h-7 w-auto shrink-0 object-contain"
      />
    </Link>
  );
}

export function WebsiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileMenuHref, setOpenMobileMenuHref] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    if (!isMobileMenuOpen) {
      setOpenMobileMenuHref(null);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-black md:transition-all md:duration-300 md:ease-out",
        isScrolled ? "md:top-3 md:px-5" : "md:top-0 md:px-0",
      )}
    >
      <Container
        className={cn(
          "grid h-16 grid-cols-[1fr_auto] items-center gap-4 bg-black md:grid-cols-[1fr_auto_1fr] md:transition-all md:duration-300 md:ease-out",
          isScrolled
            ? "md:h-14 md:max-w-[min(1560px,calc(100%-2rem))] md:rounded-sm md:px-7 md:shadow-[0_8px_70px_rgba(0,0,0,0.5)] lg:px-9"
            : "md:h-13 md:max-w-[1560px]",
        )}
      >
        <div className="flex h-full items-center justify-start">
          <BrandLink />
        </div>
        <nav
          className={cn(
            "hidden h-full items-center justify-center md:flex",
            isScrolled ? "gap-5" : "gap-6",
          )}
        >
          {websiteNavigationItems.map((item) => {
            const isMenuOpen = openMenuHref === item.href;

            return (
            <div
              key={item.href}
              className="relative flex h-full items-center"
              onMouseEnter={() => item.children && setOpenMenuHref(item.href)}
              onMouseLeave={() => item.children && setOpenMenuHref(null)}
              onFocus={() => item.children && setOpenMenuHref(item.href)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setOpenMenuHref(null);
                }
              }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-light text-white/65 transition-colors hover:text-white",
                    isActive &&
                      item.href === routes.website.home &&
                      "text-white",
                    item.children && isMenuOpen && "text-white",
                  )
                }
              >
                {item.title}
              </NavLink>
              {item.children && (
                <div
                  className={cn(
                    "pointer-events-none absolute left-0 top-full z-50 w-[min(64vw,700px)] overflow-hidden rounded-lg border border-white/15 bg-black opacity-0 shadow-[0_22px_60px_rgba(0,0,0,0.45)] transition-opacity duration-200 ease-out",
                    isMenuOpen && "pointer-events-auto opacity-100",
                  )}
                >
                  <Link
                    to={routes.website.systemPointsBreakdown}
                    className="flex min-h-16 items-center justify-between border-b border-white/15 px-5 py-3.5 text-white transition-colors hover:bg-white/10"
                    onClick={() => setOpenMenuHref(null)}
                  >
                    <span className="text-[14px] font-light">
                      System & Points Breakdown
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>

                  <div className="grid md:grid-cols-2">
                    {rankingMenuItems.slice(0, 2).map((rankingItem) => (
                      <Link
                        key={rankingItem.href}
                        to={rankingItem.href}
                        className="relative min-h-28 border-b border-white/15 px-5 py-4 text-white transition-colors hover:bg-white/10 md:border-r md:last:border-r-0"
                        onClick={() => setOpenMenuHref(null)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-light">
                              {rankingItem.title}
                            </p>
                            <p className="mt-1 text-xs font-light text-white/55">
                              {rankingItem.description}
                            </p>
                          </div>
                          <ArrowRight className="mt-1 size-4 shrink-0 text-white/45" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {rankingItem.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-xs border border-white/15 px-2.5 py-1 text-xs font-light text-white/55"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {rankingMenuItems.slice(2).map((rankingItem) => (
                    <Link
                      key={rankingItem.href}
                      to={rankingItem.href}
                      className="flex min-h-16 items-center justify-between border-b border-white/15 px-5 py-3.5 text-white transition-colors last:border-b-0 hover:bg-white/10"
                      onClick={() => setOpenMenuHref(null)}
                    >
                      <div>
                        <p className="text-sm font-light">{rankingItem.title}</p>
                        <p className="mt-1 text-xs font-light text-white/55">
                          {rankingItem.description}
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </nav>
        <div className="hidden h-full items-center justify-end md:flex">
          <Button
            asChild
            className="h-9 rounded-md bg-[#07503d] px-5 text-sm font-light text-white hover:bg-[#07503d]/95"
          >
            <Link to={routes.administrator.dashboard}>Reclub</Link>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="justify-self-end text-white hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => {
            setIsMobileMenuOpen((current) => !current);
          }}
        >
          {isMobileMenuOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
          <span className="sr-only">
            {isMobileMenuOpen ? "Close navigation" : "Open navigation"}
          </span>
        </Button>
      </Container>
    </header>
    <div
      className={cn(
        "fixed inset-x-0 top-16 z-40 flex h-[calc(100dvh-4rem)] flex-col bg-black text-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
        isMobileMenuOpen
          ? "translate-y-0"
          : "pointer-events-none -translate-y-full",
      )}
      aria-hidden={!isMobileMenuOpen}
    >
      <nav className="min-h-0 flex-1 overflow-y-auto bg-black">
        {websiteNavigationItems.map((item) => {
          const isExpanded = openMobileMenuHref === item.href;

          if (item.children) {
            return (
              <div key={item.href} className="border-b border-white/15">
                <button
                  type="button"
                  className="flex min-h-20 w-full items-center justify-between px-5 text-left font-display text-2xl font-normal tracking-normal text-white"
                  onClick={() =>
                    setOpenMobileMenuHref((current) =>
                      current === item.href ? null : item.href,
                    )
                  }
                >
                  {item.title}
                  {isExpanded ? (
                      <ChevronDown className="size-5 text-white/55" />
                    ) : (
                      <ChevronRight className="size-5 text-white/55" />
                  )}
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="min-h-0">
                    <Link
                      to={routes.website.systemPointsBreakdown}
                      className="flex min-h-14 items-center justify-between border-t border-white/15 px-5 text-base font-light text-white transition-colors hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      System & Points Breakdown
                      <ArrowRight className="size-4 text-white/55" />
                    </Link>
                    {rankingMenuItems.map((rankingItem) => (
                      <Link
                        key={rankingItem.href}
                        to={rankingItem.href}
                        className="block border-t border-white/15 px-5 py-4 text-white transition-colors hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-light">
                              {rankingItem.title}
                            </p>
                            <p className="mt-1 text-sm font-light text-white/55">
                              {rankingItem.description}
                            </p>
                          </div>
                          <ArrowRight className="mt-1 size-4 shrink-0 text-white/55" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {rankingItem.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-xs border border-white/15 px-2.5 py-1 text-xs font-light text-white/55"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex min-h-20 items-center justify-between border-b border-white/15 px-5 font-display text-2xl font-normal tracking-normal text-white transition-colors hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/15 bg-black px-5 py-5 text-sm font-light text-white/45">
        Padel experiences built for players, clubs, and communities.
      </div>
    </div>
    </>
  );
}

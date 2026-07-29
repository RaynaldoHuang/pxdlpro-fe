import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import logo from "@/assets/logo.webp";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { rankingCategoryRoutes, routes } from "@/routes/paths";

const footerColumns = [
  {
    title: "Product",
    links: [
      { title: "Ranking overview", href: routes.website.rankings },
      {
        title: "System & Points Breakdown",
        href: routes.website.systemPointsBreakdown,
      },
      { title: "PXDL Elite", href: rankingCategoryRoutes.pxdl_elite },
      { title: "PXDL Squad", href: rankingCategoryRoutes.pxdl_squad },
      { title: "PXDL Member", href: rankingCategoryRoutes.pxdl_member },
      { title: "Events", href: routes.website.events },
      { title: "Gallery", href: routes.website.gallery },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About Us", href: "/#about" },
      { title: "Blog", href: routes.website.blog },
    ],
  },
  {
    title: "Terms & Policies",
    links: [
      { title: "Terms of service", href: "/#terms" },
      { title: "Privacy policy", href: "/#privacy" },
      { title: "Cookie policy", href: "/#cookies" },
      { title: "Consent Preferences", href: "/#consent" },
    ],
  },
  {
    title: "Social",
    links: [
      { title: "Instagram", href: "/#instagram" },
      { title: "Reclub", href: routes.administrator.dashboard },
    ],
  },
];

export function WebsiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black px-5 pb-8 pt-10 text-white/60 sm:px-8 sm:pt-24 lg:px-12">
      <Container className="max-w-[1560px]">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_3fr] lg:gap-14">
          <div className="hidden space-y-8 sm:block">
            <Link to={routes.website.home} className="inline-flex items-center">
              <img
                src={logo}
                alt="PXDL logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-9 sm:grid-cols-4 sm:gap-10">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-light text-white/45">
                  {column.title}
                </h2>
                <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
                  {column.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-sm font-light text-white/65 transition-colors hover:text-white"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 border-t border-white/15 pt-8 sm:mt-24 sm:pt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-2 text-sm font-light">
              <p className="text-sm">Padel experiences built for players, clubs, and communities.</p>
              <p className="text-xs text-white/45">©2026 PXDL. All rights reserved.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 justify-self-start rounded-md border-white/20 bg-transparent px-4 text-sm font-light text-white/70 hover:bg-white/10 hover:text-white lg:justify-self-end"
              onClick={scrollToTop}
            >
              Back to top
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}

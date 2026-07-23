import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { routes } from "@/routes/paths";

const segmentLabels: Record<string, string> = {
  administrator: "Administrator",
  dashboard: "Dashboard",
  hero: "Hero",
  about: "About",
  gallery: "Gallery",
  events: "Events",
  news: "News",
  users: "Users",
  seo: "SEO",
  settings: "Settings",
};

export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        to={routes.website.home}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="size-4" />
        <span className="sr-only">Home</span>
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="size-4 text-muted-foreground" />
            {isLast ? (
              <span className="font-normal text-foreground">
                {segmentLabels[segment] ?? segment}
              </span>
            ) : (
              <Link
                to={href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {segmentLabels[segment] ?? segment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

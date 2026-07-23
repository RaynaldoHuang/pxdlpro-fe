import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  FileText,
  ImagePlus,
  Images,
  Loader2,
  Newspaper,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ContentWrapper } from "@/components/common/ContentWrapper";
import { DashboardCard } from "@/components/common/DashboardCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getAdminArticles } from "@/lib/articles";
import { getAdminGalleryFolders } from "@/lib/gallery";
import { getAdminHeroSlides } from "@/lib/heroSlides";
import { getAdminPlayers } from "@/lib/players";
import { getAdminTrustedBrands } from "@/lib/trustedBrands";
import { getAdminUsers } from "@/lib/adminUsers";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function activeSummary(active: number, total: number, label: string) {
  return `${formatNumber(active)} active ${label} of ${formatNumber(total)} total.`;
}

export function DashboardPage() {
  const { canManageUsers } = useAdminAuth();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [players, galleryFolders, articles, sponsors, heroSlides, users] =
        await Promise.all([
          getAdminPlayers(),
          getAdminGalleryFolders(),
          getAdminArticles(),
          getAdminTrustedBrands(),
          getAdminHeroSlides(),
          canManageUsers ? getAdminUsers() : Promise.resolve([]),
        ]);

      return {
        players,
        galleryFolders,
        articles,
        sponsors,
        heroSlides,
        users,
      };
    },
  });

  const totalGalleryImages =
    data?.galleryFolders.reduce(
      (total, folder) => total + (folder.images_count ?? folder.images?.length ?? 0),
      0,
    ) ?? 0;
  const activePlayers = data?.players.filter((player) => player.is_active).length ?? 0;
  const activeArticles =
    data?.articles.filter((article) => article.is_active).length ?? 0;
  const activeSponsors =
    data?.sponsors.filter((sponsor) => sponsor.is_active).length ?? 0;

  const dashboardCards = [
    {
      title: "Total Players",
      value: isLoading ? "..." : formatNumber(data?.players.length ?? 0),
      description: isLoading
        ? "Loading player data."
        : activeSummary(activePlayers, data?.players.length ?? 0, "players"),
      icon: Trophy,
    },
    {
      title: "Gallery Items",
      value: isLoading ? "..." : formatNumber(totalGalleryImages),
      description: isLoading
        ? "Loading gallery data."
        : `${formatNumber(data?.galleryFolders.length ?? 0)} gallery folders connected.`,
      icon: Images,
    },
    {
      title: "Articles",
      value: isLoading ? "..." : formatNumber(data?.articles.length ?? 0),
      description: isLoading
        ? "Loading article data."
        : activeSummary(activeArticles, data?.articles.length ?? 0, "articles"),
      icon: Newspaper,
    },
    {
      title: "Sponsors",
      value: isLoading ? "..." : formatNumber(data?.sponsors.length ?? 0),
      description: isLoading
        ? "Loading sponsor data."
        : activeSummary(activeSponsors, data?.sponsors.length ?? 0, "sponsors"),
      icon: ShieldCheck,
    },
  ];

  const contentStatus = [
    {
      label: "Hero slides",
      value: data?.heroSlides.length ?? 0,
      active: data?.heroSlides.filter((slide) => slide.is_active).length ?? 0,
      href: "/administrator/hero",
      icon: Sparkles,
    },
    {
      label: "Players",
      value: data?.players.length ?? 0,
      active: activePlayers,
      href: "/administrator/players",
      icon: Trophy,
    },
    {
      label: "Articles",
      value: data?.articles.length ?? 0,
      active: activeArticles,
      href: "/administrator/articles",
      icon: FileText,
    },
    {
      label: "Gallery folders",
      value: data?.galleryFolders.length ?? 0,
      active: data?.galleryFolders.filter((folder) => folder.is_active).length ?? 0,
      href: "/administrator/gallery",
      icon: Images,
    },
    ...(canManageUsers
      ? [
          {
            label: "Admin users",
            value: data?.users.length ?? 0,
            active: data?.users.filter((user) => user.is_active).length ?? 0,
            href: "/administrator/users",
            icon: ShieldCheck,
          },
        ]
      : []),
  ];

  return (
    <ContentWrapper>
      <PageHeader
        title="Dashboard"
        description="Live overview for PXDL administrator workspace."
      />

      {isError && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            Gagal mengambil sebagian data dashboard.
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-normal">
              <Activity className="size-4" />
              Content Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="grid min-h-40 place-items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              contentStatus.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3 transition-colors hover:bg-muted/60"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#07503d]/10 text-[#07503d]">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-normal text-foreground">
                          {item.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {formatNumber(item.active)} active of{" "}
                          {formatNumber(item.value)} total
                        </span>
                      </span>
                    </span>
                    <Badge
                      variant="outline"
                      className="border-[#07503d]/25 bg-[#07503d]/10 text-[#07503d]"
                    >
                      {formatNumber(item.value)}
                    </Badge>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              asChild
              type="button"
              className="justify-start bg-[#07503d] text-white hover:bg-[#064433]"
            >
              <Link to="/administrator/articles">
                <PlusCircle className="size-4" />
                Add article
              </Link>
            </Button>
            <Button asChild type="button" variant="outline" className="justify-start">
              <Link to="/administrator/gallery">
                <ImagePlus className="size-4" />
                Manage gallery
              </Link>
            </Button>
            <Button asChild type="button" variant="outline" className="justify-start">
              <Link to="/administrator/players">
                <Trophy className="size-4" />
                Manage players
              </Link>
            </Button>
            <Button asChild type="button" variant="outline" className="justify-start">
              <Link to="/administrator/trusted-brands">
                <ShieldCheck className="size-4" />
                Manage sponsorship
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </ContentWrapper>
  );
}

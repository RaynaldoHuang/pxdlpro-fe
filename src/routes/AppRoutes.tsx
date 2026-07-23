import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Loader2 } from "lucide-react";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdministratorLayout } from "@/layouts/AdministratorLayout";
import { WebsiteLayout } from "@/layouts/WebsiteLayout";
import { AboutPage } from "@/pages/administrator/about/AboutPage";
import { ArticlesPage } from "@/pages/administrator/articles/ArticlesPage";
import { DashboardPage } from "@/pages/administrator/dashboard/DashboardPage";
import { EventsPage } from "@/pages/administrator/events/EventsPage";
import { GalleryPage as AdminGalleryPage } from "@/pages/administrator/gallery/GalleryPage";
import { AdminLoginPage } from "@/pages/administrator/auth/LoginPage";
import { HeroPage } from "@/pages/administrator/hero/HeroPage";
import { NewsPage } from "@/pages/administrator/news/NewsPage";
import { PlayersPage } from "@/pages/administrator/players/PlayersPage";
import { SeoPage } from "@/pages/administrator/seo/SeoPage";
import { SettingsPage } from "@/pages/administrator/settings/SettingsPage";
import { TrustedBrandsPage } from "@/pages/administrator/trusted-brands/TrustedBrandsPage";
import { UsersPage } from "@/pages/administrator/users/UsersPage";
import { BlogDetailPage } from "@/pages/website/blog/BlogDetailPage";
import { BlogPage } from "@/pages/website/blog/BlogPage";
import { ComingSoonPage } from "@/pages/website/ComingSoonPage";
import { GalleryFolderPage } from "@/pages/website/gallery/GalleryFolderPage";
import { GalleryPage } from "@/pages/website/gallery/GalleryPage";
import { HomePage } from "@/pages/website/HomePage";
import { RankingsPage } from "@/pages/website/rankings/RankingsPage";
import { SystemPointsBreakdownPage } from "@/pages/website/rankings/SystemPointsBreakdownPage";
import { routes } from "@/routes/paths";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function AdminRouteGuard() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fafafa] text-foreground">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/administrator/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <AdministratorLayout />;
}

function AdminGuestRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fafafa] text-foreground">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={routes.administrator.dashboard} replace />;
  }

  return <AdminLoginPage />;
}

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path={routes.website.home} element={<HomePage />} />
          <Route path={routes.website.blog} element={<BlogPage />} />
          <Route path={routes.website.comingSoon} element={<ComingSoonPage />} />
          <Route path={routes.website.events} element={<ComingSoonPage />} />
          <Route path={routes.website.gallery} element={<GalleryPage />} />
          <Route path="/gallery/:slug" element={<GalleryFolderPage />} />
          <Route path={routes.website.rankings} element={<RankingsPage />} />
          <Route
            path={routes.website.systemPointsBreakdown}
            element={<SystemPointsBreakdownPage />}
          />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
        </Route>
        <Route path="/administrator/login" element={<AdminGuestRoute />} />
        <Route path={routes.administrator.root} element={<AdminRouteGuard />}>
          <Route
            index
            element={<Navigate to={routes.administrator.dashboard} replace />}
          />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="trusted-brands" element={<TrustedBrandsPage />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="gallery/:folderId" element={<AdminGalleryPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="seo" element={<SeoPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={routes.website.home} replace />} />
      </Routes>
    </>
  );
}

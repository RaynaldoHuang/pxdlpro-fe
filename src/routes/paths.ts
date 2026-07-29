export const routes = {
  website: {
    home: "/",
    blog: "/blog",
    comingSoon: "/coming-soon",
    events: "/events",
    gallery: "/gallery",
    rankings: "/rankings",
    systemPointsBreakdown: "/rankings/system-points-breakdown",
  },
  administrator: {
    root: "/administrator",
    dashboard: "/administrator/dashboard",
    hero: "/administrator/hero",
    trustedBrands: "/administrator/trusted-brands",
    players: "/administrator/players",
    articles: "/administrator/articles",
    about: "/administrator/about",
    gallery: "/administrator/gallery",
    events: "/administrator/events",
    news: "/administrator/news",
    users: "/administrator/users",
    seo: "/administrator/seo",
    settings: "/administrator/settings",
  },
};

export const rankingCategoryRoutes = {
  pxdl_elite: `${routes.website.rankings}?category=pxdl_elite`,
  pxdl_squad: `${routes.website.rankings}?category=pxdl_squad`,
  pxdl_member: `${routes.website.rankings}?category=pxdl_member`,
} as const;

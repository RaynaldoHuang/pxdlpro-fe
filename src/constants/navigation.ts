import {
  Image,
  Images,
  LayoutDashboard,
  Newspaper,
  Trophy,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { NavigationGroup } from "@/types/navigation";

export const administratorNavigation: NavigationGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/administrator/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Konten",
    items: [
      {
        title: "Hero",
        href: "/administrator/hero",
        icon: Sparkles,
      },
      {
        title: "Sponsorship",
        href: "/administrator/trusted-brands",
        icon: Images,
      },
      {
        title: "Players",
        href: "/administrator/players",
        icon: Trophy,
      },
      {
        title: "Gallery",
        href: "/administrator/gallery",
        icon: Image,
      },
      {
        title: "Articles",
        href: "/administrator/articles",
        icon: Newspaper,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        title: "Users",
        href: "/administrator/users",
        icon: UsersRound,
        roles: ["super_admin"],
      },
    ],
  },
];

export const userMenuItems = [
  {
    title: "Profile",
    icon: UserRound,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

import axios from "axios";
import { LogOut, Menu, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { administratorNavigation } from "@/constants/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type HeaderProps = {
  onOpenMobileSidebar: () => void;
};

type SearchResult = {
  id: string;
  title: string;
  description: string;
  type: string;
  href: string;
};

function readText(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const { canManageUsers, logout, user } = useAdminAuth();
  const navigate = useNavigate();
  const blurTimerRef = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [contentResults, setContentResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const navigationResults = useMemo(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    return administratorNavigation
      .flatMap((group) => group.items)
      .filter((item) => !item.roles || item.roles.includes(user?.role ?? ""))
      .filter((item) => includesQuery(item.title, trimmedQuery))
      .map<SearchResult>((item) => ({
        id: `nav-${item.href}`,
        title: item.title,
        description: "Admin menu",
        type: "Menu",
        href: item.href,
      }));
  }, [query, user?.role]);
  const results = [...navigationResults, ...contentResults].slice(0, 8);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setContentResults([]);
      setIsSearching(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setIsSearching(true);

      const sources = [
        {
          type: "Article",
          href: "/administrator/articles",
          endpoint: "/api/admin/articles",
          titleKeys: ["title"],
          descriptionKeys: ["excerpt", "slug"],
        },
        {
          type: "Player",
          href: "/administrator/players",
          endpoint: "/api/admin/players",
          titleKeys: ["name"],
          descriptionKeys: ["ranking_category", "gender"],
        },
        {
          type: "Gallery",
          href: "/administrator/gallery",
          endpoint: "/api/admin/gallery-folders",
          titleKeys: ["title", "name"],
          descriptionKeys: ["slug", "description"],
        },
        {
          type: "Hero",
          href: "/administrator/hero",
          endpoint: "/api/admin/hero-slides",
          titleKeys: ["title"],
          descriptionKeys: ["subtitle"],
        },
        {
          type: "Sponsor",
          href: "/administrator/trusted-brands",
          endpoint: "/api/admin/trusted-brands",
          titleKeys: ["name"],
          descriptionKeys: ["website_url"],
        },
        ...(canManageUsers
          ? [
              {
                type: "User",
                href: "/administrator/users",
                endpoint: "/api/admin/users",
                titleKeys: ["name"],
                descriptionKeys: ["email", "role"],
              },
            ]
          : []),
      ];

      const responses = await Promise.allSettled(
        sources.map(async (source) => {
          const response = await axios.get<{ data: Record<string, unknown>[] }>(
            source.endpoint,
          );

          return response.data.data
            .map((item) => {
              const title = readText(item, source.titleKeys);
              const description = readText(item, source.descriptionKeys);

              return {
                id: `${source.type}-${String(item.id ?? title)}`,
                title,
                description,
                type: source.type,
                href: source.href,
              };
            })
            .filter((result) => result.title)
            .filter(
              (result) =>
                includesQuery(result.title, trimmedQuery) ||
                includesQuery(result.description, trimmedQuery),
            );
        }),
      );

      setContentResults(
        responses.flatMap((response) =>
          response.status === "fulfilled" ? response.value : [],
        ),
      );
      setIsSearching(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [canManageUsers, query]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      toast.success("Logout berhasil.");
      navigate("/administrator/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsLogoutDialogOpen(false);
    }
  }

  function handleSearchBlur() {
    blurTimerRef.current = window.setTimeout(() => {
      setIsSearchOpen(false);
    }, 120);
  }

  function handleSearchFocus() {
    if (blurTimerRef.current) {
      window.clearTimeout(blurTimerRef.current);
    }
    setIsSearchOpen(true);
  }

  function openResult(result: SearchResult) {
    setQuery("");
    setIsSearchOpen(false);
    navigate(result.href);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur supports-backdrop-filter:bg-white/80 sm:px-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMobileSidebar}
      >
        <Menu className="size-4" />
        <span className="sr-only">Open sidebar</span>
      </Button>
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="h-9 pl-8"
          aria-label="Search dashboard"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        {isSearchOpen && query.trim() && (
          <div className="absolute left-0 top-11 z-50 w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-lg border bg-white shadow-xl">
            <div className="max-h-80 overflow-y-auto py-2">
              {isSearching && results.length === 0 ? (
                <p className="px-3 py-3 text-sm text-muted-foreground">
                  Searching...
                </p>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left hover:bg-muted"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => openResult(result)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-normal text-foreground">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {result.description || result.href}
                      </span>
                    </span>
                    <Badge variant="secondary" className="shrink-0">
                      {result.type}
                    </Badge>
                  </button>
                ))
              ) : (
                <p className="px-3 py-3 text-sm text-muted-foreground">
                  No results found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="h-10 gap-2 px-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-[#005941] text-xs font-normal leading-none text-white">
                  {initials || "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-normal sm:inline">
                {user?.name ?? "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <span className="block truncate">{user?.email}</span>
              <span className="block text-xs font-normal capitalize text-muted-foreground">
                {user?.role.replace("_", " ")}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout dari administrator?</DialogTitle>
            <DialogDescription>
              Sesi admin akan ditutup dan kamu perlu login lagi untuk mengedit
              konten website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut && <LogOut className="size-4" />}
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

import { ArticlesSection } from "@/pages/website/sections/ArticlesSection";
import { CommunityCtaSection } from "@/pages/website/sections/CommunityCtaSection";
import { HeroSection } from "@/pages/website/sections/HeroSection";
import { PlayersSection } from "@/pages/website/sections/PlayersSection";
import { TrustedBySection } from "@/pages/website/sections/TrustedBySection";

export function HomePage() {
  return (
    <main className="min-h-screen bg-black px-3 pb-3 sm:px-5 sm:pb-5">
      <HeroSection />
      <TrustedBySection />
      <PlayersSection />
      <ArticlesSection />
      {/* <OurEventsSection /> */}
      <CommunityCtaSection />
    </main>
  );
}

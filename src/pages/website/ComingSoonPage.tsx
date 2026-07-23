import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { routes } from "@/routes/paths";

export function ComingSoonPage() {
  return (
    <main className="min-h-[calc(100vh-3.25rem)] overflow-hidden bg-black text-white">
      <style>
        {`
          @keyframes neon-gradient-orbit {
            0% {
              transform: translate3d(-12%, -8%, 0) scale(1);
              opacity: 0.72;
            }
            33% {
              transform: translate3d(10%, 8%, 0) scale(1.12);
              opacity: 0.9;
            }
            66% {
              transform: translate3d(6%, -12%, 0) scale(0.96);
              opacity: 0.68;
            }
            100% {
              transform: translate3d(-12%, -8%, 0) scale(1);
              opacity: 0.72;
            }
          }

          @keyframes neon-gradient-pan {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>

      <section className="relative isolate grid min-h-[calc(100vh-3.25rem)] place-items-center px-5 text-center sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-30 bg-black" />
        <div
          className="absolute -inset-32 -z-20 bg-[radial-gradient(circle_at_30%_30%,rgba(23,255,154,0.72),transparent_28%),radial-gradient(circle_at_70%_68%,rgba(7,80,61,0.82),transparent_34%),linear-gradient(115deg,#000_0%,#022015_25%,#10f28a_45%,#063826_58%,#000_100%)] bg-size-[240%_240%] blur-3xl"
          style={{
            animation:
              "neon-gradient-orbit 16s ease-in-out infinite, neon-gradient-pan 12s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.16),rgba(0,0,0,0.84)_68%,#000_100%)]" />

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <p className="text-xs font-light uppercase tracking-normal text-white/62">
            PXDL Events
          </p>
          <h1 className="font-display mt-5 text-balance text-5xl font-normal lg:leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
            Coming Soon
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-sm font-light lg:leading-7 leading-6 text-white/70 sm:text-sm">
            We are preparing the official PXDL event hub for ranking nights,
            community sessions, tournaments, and special matchday experiences.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to={routes.website.rankings}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#07503d] px-5 text-sm font-light text-white transition-colors hover:bg-[#07503d]/95"
            >
              View rankings
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to={routes.website.systemPointsBreakdown}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/24 bg-black/20 px-5 text-sm font-light text-white/84 transition-colors hover:bg-white/10 hover:text-white"
            >
              Points breakdown
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function CommunityCtaSection() {
  return (
    <section className="bg-black px-5 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto flex min-h-108 w-full max-w-[1560px] flex-col items-center justify-center bg-[#07503d] px-6 py-14 text-center text-white sm:min-h-100 sm:py-20">
        <h2 className="font-display max-w-3xl text-4xl font-regular tracking-normal lg:leading-14 leading-10 sm:text-6xl lg:text-5xl">
          Join the PXDL community and grow your padel journey
        </h2>
        <p className="mt-6 max-w-xl text-sm font-light leading-6 text-white/75">
          Meet players, join club events, follow rankings, and become part of a
          padel network built for every level of the game.
        </p>
        <Button
          asChild
          className="mt-10 h-9 rounded-md bg-white px-5 text-sm font-light text-[#07503d] hover:bg-white/90"
        >
          <Link to="/#join-reclub">Join Reclub</Link>
        </Button>
      </div>
    </section>
  );
}

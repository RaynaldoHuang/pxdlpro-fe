import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const events = [
  {
    title: "Elite padel league nights",
    href: "/#elite-padel-league",
    className:
      "bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(135deg,rgba(7,80,61,0.92),rgba(19,19,17,0.86)),linear-gradient(45deg,#705f43,#111)]",
  },
  {
    title: "Squad tournaments across clubs",
    href: "/#squad-tournaments",
    className:
      "bg-[radial-gradient(circle_at_75%_22%,rgba(255,255,255,0.26),transparent_22%),linear-gradient(135deg,rgba(26,49,42,0.88),rgba(11,11,10,0.9)),linear-gradient(45deg,#546a5e,#151515)]",
  },
  {
    title: "Member matchday experience",
    href: "/#member-matchday",
    className:
      "bg-[radial-gradient(circle_at_35%_72%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(135deg,rgba(48,56,52,0.9),rgba(4,20,15,0.92)),linear-gradient(45deg,#282f2d,#0b0b0a)]",
  },
  {
    title: "Community open court series",
    href: "/#community-open-court",
    className:
      "bg-[radial-gradient(circle_at_70%_68%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(135deg,rgba(68,57,43,0.88),rgba(10,16,14,0.92)),linear-gradient(45deg,#514838,#101010)]",
  },
];

export function OurEventsSection() {
  return (
    <section
      id="events"
      className="bg-black px-5 py-24 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-light uppercase text-white/60">
              Our Event
            </p>
            <h2 className="font-display mt-10 max-w-xl text-5xl font-medium leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Built around the rhythm of padel
              <span className="block text-white/45">on and off court</span>
            </h2>
          </div>
          <p className="max-w-xl text-base font-light leading-7 text-white/60 lg:mt-20">
            From elite ranking nights to community matchdays, PXDL events bring
            players, clubs, and supporters together through competitive padel
            experiences designed for every level.
          </p>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.href}
              className={`relative isolate flex min-h-[520px] overflow-hidden ${event.className}`}
            >
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.76)_100%)]" />
              <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
              <div className="absolute left-8 top-8 text-xl font-semibold text-white/90">
                PXDL
              </div>

              <div className="mt-auto w-full p-8 text-white sm:p-10">
                <h3 className="font-display max-w-2xl text-4xl font-medium leading-[1.04] tracking-normal sm:text-5xl">
                  {event.title}
                </h3>
                <Button
                  asChild
                  variant="outline"
                  className="mt-8 h-11 rounded-md border-white/40 bg-transparent px-5 text-sm font-light text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to={event.href}>Learn more</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

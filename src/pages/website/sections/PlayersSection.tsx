import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPlayers,
  getPlayerRankingImage,
  rankingCategoryOptions,
  type Player as BackendPlayer,
  type RankingCategoryValue,
} from "@/lib/players";

type CarouselPlayer = {
  rank: number;
  name: string;
  image: string;
};

type PlayerCarouselProps = {
  players: CarouselPlayer[];
};

const rankingDisplayLimit = 10;

function playerToCarouselPlayer(player: BackendPlayer): CarouselPlayer {
  return {
    rank: player.rank,
    name: player.name,
    image: getPlayerRankingImage(player),
  };
}

function getWrappedIndex(index: number, length: number) {
  return (index + length) % length;
}

function sortPlayersByRanking(players: BackendPlayer[]) {
  return [...players].sort((first, second) => {
    if (second.points === first.points) {
      return first.rank - second.rank;
    }

    return second.points - first.points;
  });
}

function PlayerCarousel({ players }: PlayerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [leavingPlayer, setLeavingPlayer] = useState<CarouselPlayer | null>(
    null,
  );
  const leaveTimeoutRef = useRef<number | null>(null);
  const activePlayer = players[activeIndex];
  const previousPlayer = players[getWrappedIndex(activeIndex - 1, players.length)];
  const nextPlayer = players[getWrappedIndex(activeIndex + 1, players.length)];
  const enterAnimationClass =
    direction === "next"
      ? "player-enter-next"
      : "player-enter-previous";
  const leaveAnimationClass =
    direction === "next"
      ? "player-leave-next"
      : "player-leave-previous";

  useEffect(() => {
    setActiveIndex(0);
    setLeavingPlayer(null);
  }, [players]);

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        window.clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  function moveToIndex(nextIndex: number, nextDirection: "next" | "previous") {
    if (nextIndex === activeIndex) {
      return;
    }

    if (leaveTimeoutRef.current) {
      window.clearTimeout(leaveTimeoutRef.current);
    }

    setDirection(nextDirection);
    setLeavingPlayer(activePlayer);
    setActiveIndex(nextIndex);
    leaveTimeoutRef.current = window.setTimeout(() => {
      setLeavingPlayer(null);
      leaveTimeoutRef.current = null;
    }, 720);
  }

  function showPrevious() {
    moveToIndex(getWrappedIndex(activeIndex - 1, players.length), "previous");
  }

  function showNext() {
    moveToIndex(getWrappedIndex(activeIndex + 1, players.length), "next");
  }

  function showPlayer(index: number) {
    if (index === activeIndex) {
      return;
    }

    moveToIndex(index, index > activeIndex ? "next" : "previous");
  }

  return (
    <article className="relative isolate -mx-6 flex min-h-124 overflow-hidden bg-[linear-gradient(180deg,#020403_0%,#03160f_48%,#000_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.42)] sm:mx-0 sm:min-h-175 sm:bg-[linear-gradient(145deg,#020403_0%,#020a07_38%,#03180f_68%,#000_100%)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(7,80,61,0.34),transparent_42%),linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(3,40,28,0.24)_50%,rgba(0,0,0,0.82)_100%)] sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(3,40,28,0.38)_50%,rgba(0,0,0,0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(4,77,55,0.16)_0%,transparent_42%,rgba(0,0,0,0.82)_100%)] sm:bg-[linear-gradient(180deg,rgba(4,77,55,0.22)_0%,transparent_34%,rgba(0,0,0,0.74)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0.72)_34%,transparent_100%)] sm:hidden" />
      <button
        type="button"
        className="absolute left-2 top-1/2 z-40 flex size-9 -translate-y-1/2 items-center justify-center text-white/75 transition-colors hover:text-white sm:left-6 sm:size-12"
        aria-label="Previous player"
        onClick={showPrevious}
      >
        <ChevronLeft className="size-7 stroke-[1.7] sm:size-11" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-80 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.22)_22%,rgba(1,24,17,0.62)_58%,rgba(0,0,0,0.86)_100%)] sm:h-104 sm:bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.48)_28%,rgba(1,24,17,0.92)_66%,#000_100%)]" />

      <div className="relative grid w-full grid-rows-[1fr_auto] px-8 pb-7 pt-0 sm:px-14 sm:pb-12 sm:pt-8">
        <div className="relative flex min-h-64 items-end justify-center sm:min-h-116">
          <div className="absolute bottom-24 left-[6%] hidden w-32 opacity-18 blur-[1px] sm:block lg:w-40 xl:w-44">
            <img
              src={previousPlayer.image}
              alt=""
              className="h-auto w-full object-contain"
              aria-hidden="true"
            />
          </div>

          <div className="absolute bottom-24 right-[4%] hidden w-32 opacity-16 blur-[1px] sm:block lg:w-40 xl:w-44">
            <img
              src={nextPlayer.image}
              alt=""
              className="h-auto w-full object-contain"
              aria-hidden="true"
            />
          </div>

          {leavingPlayer && (
            <div
              key={`leaving-rank-${leavingPlayer.rank}`}
              className={`absolute bottom-18 left-[8%] z-30 select-none text-[6.5rem] font-bold leading-none text-white/90 sm:bottom-24 sm:left-[10%] sm:text-[11rem] lg:text-[8rem] ${leaveAnimationClass}`}
            >
              {leavingPlayer.rank}
            </div>
          )}

          <div
            key={`rank-${activePlayer.rank}`}
            className={`absolute bottom-18 left-[8%] z-30 select-none text-[6.5rem] font-bold leading-none text-white/90 sm:bottom-24 sm:left-[10%] sm:text-[11rem] lg:text-[8rem] ${enterAnimationClass}`}
          >
            {activePlayer.rank}
          </div>

          <div className="relative z-10 flex h-92 items-end justify-center sm:h-122 lg:h-132">
            {leavingPlayer && (
              <img
                key={`leaving-image-${leavingPlayer.name}`}
                src={leavingPlayer.image}
                alt=""
                className={`absolute bottom-0 h-full w-auto max-w-[min(74vw,390px)] object-contain drop-shadow-[0_30px_72px_rgba(0,0,0,0.62)] sm:max-w-[min(68vw,390px)] ${leaveAnimationClass}`}
                aria-hidden="true"
              />
            )}
            <img
              key={`image-${activePlayer.name}`}
              src={activePlayer.image}
              alt={activePlayer.name}
              className={`h-full w-auto max-w-[min(74vw,390px)] object-contain drop-shadow-[0_30px_72px_rgba(0,0,0,0.62)] sm:max-w-[min(68vw,390px)] ${enterAnimationClass}`}
            />
          </div>
        </div>

        <div className="relative z-30 -mt-4 text-center sm:-mt-6">
          <div className="flex  items-center justify-center">
            {leavingPlayer && (
              <h2
                key={`leaving-name-${leavingPlayer.name}`}
                className={`absolute max-w-xl text-balance text-2xl font-bold uppercase leading-[0.95] tracking-[0.04em] sm:text-4xl lg:text-4xl ${leaveAnimationClass}`}
              >
                {leavingPlayer.name}
              </h2>
            )}
            <h2
              key={`name-${activePlayer.name}`}
              className={`max-w-xl text-balance text-2xl font-semibold uppercase leading-[0.95] tracking-[0.04em] sm:text-4xl lg:text-4xl ${enterAnimationClass}`}
            >
              {activePlayer.name}
            </h2>
          </div>

          <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-3 sm:mt-7 sm:gap-2">
            {players.map((player, index) => (
              <button
                key={`${player.name}-${player.rank}`}
                type="button"
                className={`rounded-full bg-white shadow-[0_0_16px_rgba(12,122,88,0.42)] transition-all hover:scale-125 ${
                  index === activeIndex
                    ? "size-1 opacity-100 sm:size-2"
                    : "size-1.5 opacity-55"
                }`}
                aria-label={`Show ${player.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => showPlayer(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute right-2 top-1/2 z-40 flex size-9 -translate-y-1/2 items-center justify-center text-white/75 transition-colors hover:text-white sm:right-6 sm:size-12"
        aria-label="Next player"
        onClick={showNext}
      >
        <ChevronRight className="size-7 stroke-[1.7] sm:size-11" />
      </button>
    </article>
  );
}

export function PlayersSection() {
  const [menRanking, setMenRanking] =
    useState<RankingCategoryValue>("pxdl_elite");
  const [womenRanking, setWomenRanking] =
    useState<RankingCategoryValue>("pxdl_squad");
  const { data: menData } = useQuery({
    queryKey: ["players", menRanking],
    queryFn: () => getPlayers(menRanking),
  });
  const { data: womenData } = useQuery({
    queryKey: ["players", womenRanking],
    queryFn: () => getPlayers(womenRanking),
  });
  const { activeMenPlayers, activeWomenPlayers } = useMemo(() => {
    const activeMen = menData?.filter((player) => player.is_active) ?? [];
    const activeWomen = womenData?.filter((player) => player.is_active) ?? [];
    const men = sortPlayersByRanking(
      activeMen.filter((player) => player.gender === "men"),
    )
      .slice(0, rankingDisplayLimit)
      .map(playerToCarouselPlayer);
    const women = sortPlayersByRanking(
      activeWomen.filter((player) => player.gender === "women"),
    )
      .slice(0, rankingDisplayLimit)
      .map(playerToCarouselPlayer);

    return {
      activeMenPlayers: men,
      activeWomenPlayers: women,
    };
  }, [menData, womenData]);
  const hasPlayers =
    activeMenPlayers.length > 0 || activeWomenPlayers.length > 0;

  return (
    <section className="bg-black px-3 py-7 text-white sm:px-5 sm:py-14">
      <style>
        {`
          @keyframes player-enter-next {
            0% {
              opacity: 0;
              transform: translate3d(18%, 0, 0) scale(0.98);
              filter: blur(5px);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes player-enter-previous {
            0% {
              opacity: 0;
              transform: translate3d(-18%, 0, 0) scale(0.98);
              filter: blur(5px);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes player-leave-next {
            0% {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
              filter: blur(0);
            }
            100% {
              opacity: 0;
              transform: translate3d(-18%, 0, 0) scale(0.98);
              filter: blur(5px);
            }
          }

          @keyframes player-leave-previous {
            0% {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
              filter: blur(0);
            }
            100% {
              opacity: 0;
              transform: translate3d(18%, 0, 0) scale(0.98);
              filter: blur(5px);
            }
          }

          .player-enter-next {
            animation: player-enter-next 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .player-enter-previous {
            animation: player-enter-previous 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .player-leave-next {
            animation: player-leave-next 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .player-leave-previous {
            animation: player-leave-previous 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}
      </style>
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-6 sm:gap-8">
        <div className="grid gap-5 px-1 sm:gap-7 sm:px-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-xs font-light uppercase tracking-normal text-white/55">
              Players Overview
            </p>
            <h2 className="mt-4 text-balance text-4xl font-normal leading-[0.95] tracking-normal font-display sm:mt-5 sm:text-7xl lg:text-5xl">
              Player and Teams
            </h2>
            <p className="mt-4 max-w-none text-sm font-light leading-relaxed text-white/60 sm:mt-6 sm:max-w-2xl sm:text-balance sm:text-xs">
              Discover standout players, rising clubs, and connected padel
              communities across Asia Pacific. Build your profile, expand your
              network, and grow with the game.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Select
              value={menRanking}
              onValueChange={(value) =>
                setMenRanking(value as RankingCategoryValue)
              }
            >
              <SelectTrigger
                aria-label="Select men's ranking category"
                className="h-9! w-full min-w-48 rounded-md border-0 bg-[#07503d] px-4 text-sm font-light text-white shadow-none hover:bg-[#07503d]/95 focus-visible:ring-white/25 sm:w-52 [&_svg]:text-white/70"
              >
                <span>Men · <SelectValue /></span>
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="min-w-52 rounded-md border-0 bg-[#07503d] p-1.5 text-white shadow-none"
              >
                {rankingCategoryOptions.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="h-11 rounded-sm pl-4 pr-10 text-sm font-light text-white/80 focus:bg-white/12 focus:text-white data-[state=checked]:bg-white/14 data-[state=checked]:text-white"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={womenRanking}
              onValueChange={(value) =>
                setWomenRanking(value as RankingCategoryValue)
              }
            >
              <SelectTrigger
                aria-label="Select women's ranking category"
                className="h-9! w-full min-w-52 rounded-md border-0 bg-[#07503d] px-4 text-sm font-light text-white shadow-none hover:bg-[#07503d]/95 focus-visible:ring-white/25 sm:w-56 [&_svg]:text-white/70"
              >
                <span>Women · <SelectValue /></span>
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="min-w-56 rounded-md border-0 bg-[#07503d] p-1.5 text-white shadow-none"
              >
                {rankingCategoryOptions.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="h-11 rounded-sm pl-4 pr-10 text-sm font-light text-white/80 focus:bg-white/12 focus:text-white data-[state=checked]:bg-white/14 data-[state=checked]:text-white"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasPlayers ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {activeMenPlayers.length > 0 && (
              <PlayerCarousel players={activeMenPlayers} />
            )}
            {activeWomenPlayers.length > 0 && (
              <PlayerCarousel players={activeWomenPlayers} />
            )}
          </div>
        ) : (
          <div className="flex min-h-80 items-center justify-center bg-[linear-gradient(145deg,#020403_0%,#020a07_45%,#000_100%)] px-6 text-center text-sm font-light text-white/55">
            No players are available for this ranking yet.
          </div>
        )}

      </div>
    </section>
  );
}

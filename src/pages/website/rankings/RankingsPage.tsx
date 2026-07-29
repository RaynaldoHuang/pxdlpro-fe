import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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
  getRankingCategoryLabel,
  rankingCategoryOptions,
  type Player,
  type RankingCategoryValue,
} from "@/lib/players";

const rankingFilters = [...rankingCategoryOptions] as const;
const rankingDisplayLimit = 10;
const rankingCategoryValues = rankingCategoryOptions.map(
  (option) => option.value,
);

function isRankingCategoryValue(
  value: string | null,
): value is RankingCategoryValue {
  return rankingCategoryValues.includes(value as RankingCategoryValue);
}

function sortPlayersByPoints(players: Player[]) {
  return [...players].sort((first, second) => {
    if (second.points !== first.points) {
      return second.points - first.points;
    }

    return first.rank - second.rank;
  });
}

function RankingTopTen({
  title,
  players,
}: {
  title: string;
  players: Player[];
}) {
  const highlightedPlayers = players.slice(0, rankingDisplayLimit);

  return (
    <section className="min-h-full bg-black py-4">
      <div className="mb-3 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-light uppercase tracking-normal text-white/45">
            Top 10 ranking
          </p>
          <h2 className="font-display mt-2 text-4xl font-normal leading-none text-white sm:text-5xl">
            {title}
          </h2>
        </div>
      </div>

      {highlightedPlayers.length === 0 ? (
        <div className="flex min-h-44 items-center justify-center text-center text-sm font-light text-white/55">
          No active players available.
        </div>
      ) : (
        <div className="grid gap-12 pt-10 sm:gap-10">
          {highlightedPlayers.map((player, index) => {
            const playerImage = getPlayerRankingImage(player);

            return (
              <article
                key={player.id}
                className="group relative isolate grid min-h-32 grid-cols-[168px_minmax(0,1fr)] items-center overflow-visible bg-[linear-gradient(90deg,rgba(5,80,61,0.98)_0%,rgba(3,42,31,0.9)_34%,rgba(0,0,0,0.9)_100%)] px-3 transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-30 sm:grid-cols-[108px_190px_1fr_66px] sm:px-4"
              >
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(18,142,103,0.35),transparent_34%)] opacity-90" />

                <div className="absolute left-3 top-1/2 z-30 flex w-18 -translate-y-1/2 select-none items-center justify-center text-center text-[3rem] font-bold leading-none text-white/95 sm:hidden">
                  {player.rank || index + 1}
                </div>

                <div className="relative z-30 hidden flex-col justify-center sm:flex">
                  <span className="text-4xl font-normal leading-none text-white">
                    {player.points}
                  </span>
                  <span className="mt-1 text-[10px] font-light uppercase tracking-normal text-white/55">
                    Points
                  </span>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-[2.6rem] z-20 flex h-42 w-30 items-end justify-center overflow-visible sm:left-24 sm:h-36 sm:w-40 sm:overflow-hidden lg:left-28">
                  {playerImage ? (
                    <img
                      src={playerImage}
                      alt=""
                      className="h-42 w-auto max-w-none translate-y-0 object-contain object-bottom drop-shadow-[0_18px_42px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.03] sm:h-40 sm:max-w-full sm:translate-y-4"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-white/10 text-white/45">
                      <Trophy className="size-7" />
                    </div>
                  )}
                </div>

                <div className="relative z-30 col-start-2 min-w-0 py-4 pl-0 sm:col-start-3 sm:pl-2 sm:pr-0">
                  <p className="line-clamp-2 text-base font-semibold uppercase leading-tight text-white sm:truncate sm:text-2xl sm:leading-none">
                    {player.name}
                  </p>
                  <p className="mt-2 text-sm font-light leading-none text-white/85 sm:hidden">
                    {player.points} points
                  </p>
                  <p className="mt-2 hidden text-xs font-light uppercase tracking-normal text-white/50 sm:block">
                    {getRankingCategoryLabel(player.ranking_category)}
                  </p>
                </div>

                <div className="relative z-30 hidden justify-self-end text-right sm:col-start-4 sm:block">
                  <span className="text-xs font-light uppercase tracking-normal text-white/45">
                    Rank
                  </span>
                  <p className="mt-1 text-3xl font-semibold leading-none text-white">
                    {player.rank || index + 1}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function RankingTable({
  players,
}: {
  players: Player[];
}) {
  const tablePlayers = players.slice(rankingDisplayLimit);

  if (tablePlayers.length === 0) {
    return null;
  }

  return (
    <section className="min-h-full bg-black py-4">
      <div>
        <div className="grid grid-cols-[72px_88px_minmax(0,1fr)_90px] bg-[#07503d] px-4 py-3 text-xs font-light uppercase tracking-normal text-white/80">
          <div>Rank</div>
          <div aria-hidden="true" />
          <div>Player</div>
          <div className="text-right">Points</div>
        </div>

        <div className="mt-3 grid gap-3">
          {tablePlayers.map((player, index) => {
            const playerImage = getPlayerRankingImage(player);

            return (
              <article
                key={player.id}
                className="grid min-h-20 grid-cols-[64px_70px_minmax(0,1fr)_76px] items-center overflow-hidden border border-white/45 bg-[linear-gradient(90deg,rgba(3,42,31,0.72),rgba(0,0,0,0.8))] px-4 text-white sm:grid-cols-[72px_88px_minmax(0,1fr)_90px]"
              >
                <div className="text-2xl font-semibold leading-none">
                  {player.rank || index + rankingDisplayLimit + 1}
                </div>
                <div className="flex h-full -translate-x-3 items-end justify-center self-end overflow-hidden sm:translate-x-0">
                  {playerImage ? (
                    <img
                      src={playerImage}
                      alt=""
                      className="h-18 w-auto translate-y-1 object-contain object-bottom sm:h-20"
                    />
                  ) : (
                    <Trophy className="mb-4 size-6 text-white/45" />
                  )}
                </div>
                <div className="min-w-0 pl-3 sm:pl-0">
                  <p className="line-clamp-2 text-xs font-normal uppercase leading-tight sm:truncate sm:text-sm">
                    {player.name}
                  </p>
                </div>
                <div className="text-right text-2xl font-normal">
                  {player.points}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function RankingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const rankingFilter = isRankingCategoryValue(categoryParam)
    ? categoryParam
    : "pxdl_elite";
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["players", rankingFilter],
    queryFn: () => getPlayers(rankingFilter),
  });

  const { menPlayers, womenPlayers } = useMemo(() => {
    const activePlayers = data.filter((player) => player.is_active);

    return {
      menPlayers: sortPlayersByPoints(
        activePlayers.filter((player) => player.gender === "men"),
      ),
      womenPlayers: sortPlayersByPoints(
        activePlayers.filter((player) => player.gender === "women"),
      ),
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-black px-5 pb-10 pt-20 text-white sm:px-8 sm:pb-14 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-8">
        <div className="grid gap-7 px-1 sm:px-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-xs font-light uppercase tracking-normal text-white/55">
              Ranking Overview
            </p>
            <h1 className="font-display mt-5 text-balance text-4xl font-normal leading-[0.95] tracking-normal sm:text-7xl lg:text-6xl">
              PXDL Rankings
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-sm font-light leading-relaxed text-white/60">
              Explore player standings across Men and Women rankings, ordered
              by points from the admin dashboard.
            </p>
          </div>

          <Select
            value={rankingFilter}
            onValueChange={(value) => setSearchParams({ category: value })}
          >
            <SelectTrigger className="h-11! w-full min-w-52 rounded-md border-0 bg-[#07503d] px-4 text-sm font-light text-white shadow-none transition-colors hover:bg-[#07503d]/95 focus-visible:ring-white/25 sm:w-56 [&_svg]:text-white/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="min-w-56 rounded-md border-0 bg-[#07503d] p-1.5 text-left text-white shadow-none"
            >
              {rankingFilters.map((filter) => (
                <SelectItem
                  key={filter.value}
                  value={filter.value}
                  className="h-9 justify-start rounded-sm py-0 pl-4 pr-10 text-left text-sm font-light text-white/80 focus:bg-white/12 focus:text-white data-[state=checked]:bg-white/14 data-[state=checked]:text-white [&>span:first-child]:right-4"
                >
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center text-white/60">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading rankings...
          </div>
        ) : isError ? (
          <div className="flex min-h-96 items-center justify-center text-center text-sm font-light text-white/55">
            Ranking data is not available yet.
          </div>
        ) : (
          <div className="grid gap-12">
            <div className="grid gap-3 lg:grid-cols-2">
              <RankingTopTen title="Men" players={menPlayers} />
              <RankingTopTen title="Women" players={womenPlayers} />
            </div>

            {(menPlayers.length > rankingDisplayLimit ||
              womenPlayers.length > rankingDisplayLimit) && (
              <div className="grid gap-3 lg:grid-cols-2">
                <RankingTable players={menPlayers} />
                <RankingTable players={womenPlayers} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

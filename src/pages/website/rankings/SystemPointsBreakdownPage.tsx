const weeklyProgramSchedule = [
  {
    day: "Monday",
    programs: [
      {
        name: "PXDL Elite",
        time: "14.00-18.00",
        points: ["No Registration Points", "Win Game: 100 pts"],
      },
      {
        name: "PXDL Linu",
        time: "17.00-20.00",
        points: ["Registration: 25 pts"],
      },
      {
        name: "Open Fixed Reclub",
        time: "19.00-23.00",
        points: [
          "Registration: 75 pts",
          "Semifinal: 75 pts",
          "Runner-up: 150 pts",
          "Champion: 200 pts",
        ],
      },
    ],
  },
  {
    day: "Tuesday",
    programs: [
      {
        name: "PXDL Morning",
        time: "09.00-11.00",
        points: ["Registration: 25 pts", "1st & 2nd: +25 pts"],
      },
      {
        name: "PXDL Squad",
        time: "19.00-22.00",
        points: [
          "Registration: 50 pts",
          "Match by Host",
          "Game Points: TBA (next page)",
        ],
      },
    ],
  },
  {
    day: "Wednesday",
    programs: [
      {
        name: "PXDL Linu",
        time: "06.00-08.00",
        points: ["Registration: 25 pts"],
      },
      {
        name: "PXDL Elite",
        time: "14.00-18.00",
        points: ["No Registration Points", "Win Game: 100 pts"],
      },
      {
        name: "PXDL Women Fixed",
        time: "19.00-22.00",
        points: [
          "Registration: 50 pts",
          "Match by Host",
          "Runner-up: 50 pts",
          "Champion: 100 pts",
          "Game Points: TBA",
        ],
      },
    ],
  },
  {
    day: "Thursday",
    programs: [
      {
        name: "PXDL Morning",
        time: "09.00-11.00",
        points: ["Registration: 25 pts", "1st & 2nd: +25 pts"],
      },
      {
        name: "PXDL Squad",
        time: "19.00-22.00",
        points: [
          "Registration: 50 pts",
          "Match by Host",
          "Game Points: TBA (next page)",
        ],
      },
    ],
  },
  {
    day: "Friday",
    programs: [
      {
        name: "PXDL Elite",
        time: "14.00-18.00",
        points: ["No Registration Points", "Win Game: 100 pts"],
      },
      {
        name: "PXDL Ceria",
        time: "19.00-22.00",
        points: [
          "Registration: 50 pts",
          "Low: 1st & 2nd = 50 pts",
          "Mid: 1st & 2nd = 50 pts",
          "High: 1st & 2nd = 100 pts",
        ],
      },
    ],
  },
  {
    day: "Saturday",
    programs: [
      {
        name: "PXDL Linu",
        time: "06.00-08.00",
        points: ["Registration: 25 pts"],
      },
      {
        name: "PXDL Morning",
        time: "09.00-11.00",
        points: ["Registration: 25 pts", "1st & 2nd: +25 pts"],
      },
    ],
  },
  {
    day: "Sunday",
    programs: [
      {
        name: "PXDL Sunday Session",
        time: "16.00-19.00",
        points: [
          "Registration: 50 pts",
          "Mix: 1st & 2nd = 50 pts",
          "Silver: 1st & 2nd = 100 pts",
          "Gold: 1st & 2nd = 150 pts",
        ],
      },
      {
        name: "PXDL Underground",
        time: "19.00-22.00",
        points: ["No Registration Points", "Win Game: 100 pts"],
      },
    ],
  },
] as const;

const challengePointRows = [
  { matchup: "SQ + SQ vs SQ + SQ", winnerEarns: "50 pts" },
  { matchup: "SQ + EL vs SQ + EL", winnerEarns: "50 pts" },
  { matchup: "SQ + SQ vs EL + EL", winnerEarns: "SQ: 100 pts | EL: 25 pts" },
  {
    matchup: "SQ + EL vs EL + EL",
    winnerEarns: "SQ+EL: 75 pts | EL+EL: 50 pts",
  },
  { matchup: "SQ + WO vs SQ + WO", winnerEarns: "50 pts" },
  {
    matchup: "SQ + WO vs WO + WO",
    winnerEarns: "SQ+WO: 25 pts | WO+WO: 75 pts",
  },
  { matchup: "EL + WO vs EL + WO", winnerEarns: "50 pts" },
  {
    matchup: "EL + WO vs WO + WO",
    winnerEarns: "EL+WO: 25 pts | WO+WO: 75 pts",
  },
  {
    matchup: "EL + WO vs SQ + WO",
    winnerEarns: "EL+WO: 25 pts | SQ+WO: 50 pts",
  },
  { matchup: "WO + WO vs WO + WO", winnerEarns: "50 pts" },
] as const;

const challengeRules = [
  "Men Squad and Men Member use the same Challenge Point system.",
  "Women Squad and Women Member use the same Challenge Point system.",
  "Challenge Matches are assigned by the host.",
  "Points are awarded only to the winning pair.",
  "Challenge Points apply to PXDL Squad and PXDL Women Fixed sessions.",
] as const;

const classificationLegend = [
  { code: "SQ", label: "Squad Member" },
  { code: "EL", label: "Elite Member" },
  { code: "WO", label: "Women Member" },
] as const;

const tournamentClassRows = [
  {
    tournamentClass: "Small Local",
    multiplier: "0.5x",
    welcomePoints: "100 points",
  },
  {
    tournamentClass: "Big Local",
    multiplier: "1x",
    welcomePoints: "200 points",
  },
  {
    tournamentClass: "National",
    multiplier: "2x",
    welcomePoints: "400 points",
  },
  {
    tournamentClass: "International",
    multiplier: "4x",
    welcomePoints: "800 points",
  },
] as const;

const smallLocalTournamentRows = [
  {
    category: "Lower Bronze Women",
    achievements: [
      { name: "Semifinal", points: "50" },
      { name: "Final", points: "100" },
      { name: "Champion", points: "200" },
    ],
  },
  {
    category: "Upper Bronze Women",
    achievements: [
      { name: "Semifinal", points: "100" },
      { name: "Final", points: "200" },
      { name: "Champion", points: "300" },
    ],
  },
  {
    category: "Lower Bronze Men",
    achievements: [
      { name: "Round of 16", points: "50" },
      { name: "Quarterfinal", points: "100" },
      { name: "Semifinal", points: "200" },
      { name: "Final", points: "300" },
      { name: "Champion", points: "400" },
    ],
  },
  {
    category: "Upper Bronze Men",
    achievements: [
      { name: "Round of 16", points: "75" },
      { name: "Quarterfinal", points: "150" },
      { name: "Semifinal", points: "300" },
      { name: "Final", points: "450" },
      { name: "Champion", points: "600" },
    ],
  },
  {
    category: "Lower Silver Men",
    achievements: [
      { name: "Quarterfinal", points: "250" },
      { name: "Semifinal", points: "400" },
      { name: "Final", points: "600" },
      { name: "Champion", points: "900" },
    ],
  },
  {
    category: "Upper Silver",
    achievements: [
      { name: "Round of 16", points: "250" },
      { name: "Quarterfinal", points: "400" },
      { name: "Semifinal", points: "600" },
      { name: "Final", points: "900" },
      { name: "Champion", points: "1,200" },
    ],
  },
] as const;

const bigLocalTournamentRows = [
  {
    category: "Lower Bronze Women",
    achievements: [
      { name: "Semifinal", points: "100" },
      { name: "Final", points: "200" },
      { name: "Champion", points: "400" },
    ],
  },
  {
    category: "Upper Bronze Women",
    achievements: [
      { name: "Semifinal", points: "200" },
      { name: "Final", points: "400" },
      { name: "Champion", points: "600" },
    ],
  },
  {
    category: "Lower Bronze Men",
    achievements: [
      { name: "Round of 16", points: "100" },
      { name: "Quarterfinal", points: "200" },
      { name: "Semifinal", points: "400" },
      { name: "Final", points: "600" },
      { name: "Champion", points: "800" },
    ],
  },
  {
    category: "Upper Bronze Men",
    achievements: [
      { name: "Round of 16", points: "150" },
      { name: "Quarterfinal", points: "300" },
      { name: "Semifinal", points: "600" },
      { name: "Final", points: "900" },
      { name: "Champion", points: "1,200" },
    ],
  },
  {
    category: "Lower Silver Men",
    achievements: [
      { name: "Quarterfinal", points: "500" },
      { name: "Semifinal", points: "800" },
      { name: "Final", points: "1,200" },
      { name: "Champion", points: "1,800" },
    ],
  },
  {
    category: "Upper Silver",
    achievements: [
      { name: "Round of 16", points: "500" },
      { name: "Quarterfinal", points: "800" },
      { name: "Semifinal", points: "1,200" },
      { name: "Final", points: "1,800" },
      { name: "Champion", points: "2,400" },
    ],
  },
] as const;

const nationalTournamentRows = [
  {
    category: "Lower Bronze Women",
    achievements: [
      { name: "Semifinal", points: "200" },
      { name: "Final", points: "400" },
      { name: "Champion", points: "800" },
    ],
  },
  {
    category: "Upper Bronze Women",
    achievements: [
      { name: "Semifinal", points: "400" },
      { name: "Final", points: "800" },
      { name: "Champion", points: "1,200" },
    ],
  },
  {
    category: "Lower Bronze Men",
    achievements: [
      { name: "Round of 16", points: "200" },
      { name: "Quarterfinal", points: "400" },
      { name: "Semifinal", points: "800" },
      { name: "Final", points: "1,200" },
      { name: "Champion", points: "1,600" },
    ],
  },
  {
    category: "Upper Bronze Men",
    achievements: [
      { name: "Round of 16", points: "300" },
      { name: "Quarterfinal", points: "600" },
      { name: "Semifinal", points: "1,200" },
      { name: "Final", points: "1,800" },
      { name: "Champion", points: "2,400" },
    ],
  },
  {
    category: "Lower Silver Men",
    achievements: [
      { name: "Quarterfinal", points: "1,000" },
      { name: "Semifinal", points: "1,600" },
      { name: "Final", points: "2,400" },
      { name: "Champion", points: "3,600" },
    ],
  },
  {
    category: "Upper Silver",
    achievements: [
      { name: "Round of 16", points: "1,000" },
      { name: "Quarterfinal", points: "1,600" },
      { name: "Semifinal", points: "2,400" },
      { name: "Final", points: "3,600" },
      { name: "Champion", points: "4,800" },
    ],
  },
] as const;

const internationalTournamentRows = [
  {
    category: "Lower Bronze Women",
    achievements: [
      { name: "Semifinal", points: "400" },
      { name: "Final", points: "800" },
      { name: "Champion", points: "1,600" },
    ],
  },
  {
    category: "Upper Bronze Women",
    achievements: [
      { name: "Semifinal", points: "800" },
      { name: "Final", points: "1,600" },
      { name: "Champion", points: "2,400" },
    ],
  },
  {
    category: "Lower Bronze Men",
    achievements: [
      { name: "Round of 16", points: "400" },
      { name: "Quarterfinal", points: "800" },
      { name: "Semifinal", points: "1,600" },
      { name: "Final", points: "2,400" },
      { name: "Champion", points: "3,200" },
    ],
  },
  {
    category: "Upper Bronze Men",
    achievements: [
      { name: "Round of 16", points: "600" },
      { name: "Quarterfinal", points: "1,200" },
      { name: "Semifinal", points: "2,400" },
      { name: "Final", points: "3,600" },
      { name: "Champion", points: "4,800" },
    ],
  },
  {
    category: "Lower Silver Men",
    achievements: [
      { name: "Quarterfinal", points: "2,000" },
      { name: "Semifinal", points: "3,200" },
      { name: "Final", points: "4,800" },
      { name: "Champion", points: "7,200" },
    ],
  },
  {
    category: "Upper Silver",
    achievements: [
      { name: "Round of 16", points: "2,000" },
      { name: "Quarterfinal", points: "3,200" },
      { name: "Semifinal", points: "4,800" },
      { name: "Final", points: "7,200" },
      { name: "Champion", points: "9,600" },
    ],
  },
] as const;

export function SystemPointsBreakdownPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-[#07503d] px-6 py-16 text-center text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto flex w-full max-w-[1560px] flex-col items-center">
          <h1 className="max-w-88 text-balance font-display text-4xl font-normal leading-11 tracking-normal text-white sm:max-w-5xl sm:text-6xl lg:text-5xl">
            System & Points Breakdown
          </h1>
          <p className="mx-auto mt-7 max-w-88 text-sm font-light leading-6 text-white/70 sm:max-w-3xl sm:text-sm sm:leading-7">
            Learn how PXDL PRO points are earned through programs, challenge
            matches, and official tournament performance.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            Play. Earn Points. Climb the Ranking
          </h2>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            The PXDL PRO Ranking System rewards players for participating in
            official PXDL sessions, winning matches, achieving tournament
            milestones, and completing host-assigned challenge matches.  Every point contributes to your position on the PXDL PRO
            leaderboard.
          </p>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 sm:pb-18 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            How the Ranking System Works 
          </h2>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Players can earn ranking points through three main activities:
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="border border-white/12 px-5 py-4 text-sm font-semibold text-white sm:text-base">
              PXDL Weekly Programs
            </div>
            <div className="border border-white/12 px-5 py-4 text-sm font-semibold text-white sm:text-base">
              Challenge Matches
            </div>
            <div className="border border-white/12 px-5 py-4 text-sm font-semibold text-white sm:text-base">
              Official Tournaments
            </div>
          </div>
          <p className="mt-7 text-sm font-light leading-7 sm:text-base">
            The total points collected from these activities determine each
            player&apos;s position on the PXDL PRO leaderboard. Higher
            participation, consistent match performance, and stronger tournament
            results will help players move up the ranking.
          </p>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 sm:pb-18 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            1. Weekly Program Points
          </h2>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Earn points by joining selected PXDL programs throughout the week.
          </p>
          <p className="mt-4 text-sm font-light leading-7 sm:text-base">
            Depending on the program, players may receive :
          </p>
          <ul className="mt-6 grid gap-2 text-sm font-light leading-7 sm:grid-cols-2 sm:text-base">
            <li className="border-b border-white/10 pb-2">
              Registration points
            </li>
            <li className="border-b border-white/10 pb-2">
              Match-win points
            </li>
            <li className="border-b border-white/10 pb-2">
              Placement bonuses
            </li>
            <li className="border-b border-white/10 pb-2">
              Semifinal points
            </li>
            <li className="border-b border-white/10 pb-2">
              Runner-up points
            </li>
            <li className="border-b border-white/10 pb-2">Champion points</li>
          </ul>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Each PXDL program has its own point structure.
          </p>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 sm:pb-18 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            Weekly Program Point Schedule
          </h2>
          <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
            <table className="w-full min-w-[640px] border-collapse sm:min-w-180 border border-white/18 text-left">
              <thead>
                <tr className="bg-[#07503d] text-white">
                  <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                    Day
                  </th>
                  <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                    Program
                  </th>
                  <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                    Points Earned
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklyProgramSchedule.map((daySchedule) =>
                  daySchedule.programs.map((program, index) => (
                    <tr
                      key={`${daySchedule.day}-${program.name}`}
                      className="bg-white/[0.03] text-white/72"
                    >
                      {index === 0 && (
                        <td
                          rowSpan={daySchedule.programs.length}
                          className="w-32 border border-white/18 px-3 py-3 align-middle text-sm font-normal text-white sm:w-48 sm:px-5 sm:py-4 sm:text-base"
                        >
                          {daySchedule.day}
                        </td>
                      )}
                      <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white sm:px-5 sm:py-4 sm:text-base">
                        <span>{program.name}</span>
                        <span className="mt-1 block text-white/72">
                          {program.time}
                        </span>
                      </td>
                      <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white/85 sm:px-5 sm:py-4 sm:text-base">
                        <ul className="list-disc space-y-1 pl-5">
                          {program.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 sm:pb-18 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            2. Challenge Match Points
          </h2>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Challenge Matches are special matches arranged by the host during
            selected PXDL Squad and PXDL Women Fixed sessions. Challenge Points are awarded only to the winning pair. The number of
            points earned depends on the combination of player classifications in
            the match.
          </p>
      
          <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
            <table className="w-full min-w-[640px] border-collapse sm:min-w-[720px] border border-white/18 text-left">
              <thead>
                <tr className="bg-[#07503d] text-white">
                  <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                    Matchup
                  </th>
                  <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                    Winner Earns
                  </th>
                </tr>
              </thead>
              <tbody>
                {challengePointRows.map((row) => (
                  <tr
                    key={row.matchup}
                    className="odd:bg-white/[0.03] even:bg-white/[0.055]"
                  >
                    <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white sm:px-5 sm:py-4 sm:text-base">
                      {row.matchup}
                    </td>
                    <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white/85 sm:px-5 sm:py-4 sm:text-base">
                      {row.winnerEarns}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-base font-normal text-white sm:flex-row sm:flex-wrap sm:gap-x-12">
            {classificationLegend.map((item) => (
              <div
                key={item.code}
                className="whitespace-nowrap"
              >
                {item.code} : {item.label}
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
              Important Challenge Match Rules
            </h3>
            <ul className="mt-7 grid text-base font-normal leading-7 text-white/68">
              {challengeRules.map((rule) => (
                <li key={rule} className="border-b border-white/10 py-4">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 sm:pb-18 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            3. Tournament Ranking Points
          </h2>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Players can also earn ranking points by joining eligible
            tournaments.
          </p>
          <p className="mt-4 text-sm font-light leading-7 sm:text-base">
            Tournament points are determined by:
          </p>
          <ul className="mt-6 grid gap-2 text-sm font-light leading-7 sm:text-base">
            <li className="border-b border-white/10 pb-2">
              Tournament class
            </li>
            <li className="border-b border-white/10 pb-2">
              Player category
            </li>
            <li className="border-b border-white/10 pb-2">
              Final achievement or finishing stage
            </li>
          </ul>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Every tournament participant also receives Welcome Points based on the tournament class. Tournament classes use 0.5x, 1x, 2x, and 4x multipliers, with Welcome Points ranging from 100 to 800 points.
          </p>

          <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
            <table className="w-full min-w-[640px] border-collapse sm:min-w-[720px] text-left">
              <thead>
                <tr className="text-white">
                  <th className="border-b border-white/18 px-0 py-3 pr-3 text-sm font-normal sm:py-4 sm:pr-5 sm:text-base">
                    Tournament Class
                  </th>
                  <th className="border-b border-white/18 px-3 py-3 text-sm font-normal sm:px-5 sm:py-4 sm:text-base">
                    Multiplier
                  </th>
                  <th className="border-b border-white/18 px-3 py-3 text-right text-sm font-normal sm:px-5 sm:py-4 sm:text-base">
                    Welcome Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {tournamentClassRows.map((row) => (
                  <tr key={row.tournamentClass}>
                    <td className="border-b border-white/10 px-0 py-4 pr-3 text-sm font-normal text-white sm:py-6 sm:pr-5 sm:text-base">
                      {row.tournamentClass}
                    </td>
                    <td className="border-b border-white/10 px-3 py-4 text-sm font-normal text-white/85 sm:px-5 sm:py-6 sm:text-base">
                      {row.multiplier}
                    </td>
                    <td className="border-b border-white/10 px-3 py-4 text-right text-sm font-normal text-white/85 sm:px-5 sm:py-6 sm:text-base">
                      {row.welcomePoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
              Small Local Tournament
            </h3>
            <p className="mt-5 text-sm font-light leading-7 sm:text-base">
              <strong className="font-normal text-white">Multiplier:</strong>{" "}
              0.5x{" "}
              <span className="mx-2 text-white/35">|</span>
              <strong className="font-normal text-white">
                Welcome Points:
              </strong>{" "}
              100 points
            </p>

            <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
              <table className="w-full min-w-[640px] border-collapse sm:min-w-[720px] border border-white/18 text-left">
                <thead>
                  <tr className="bg-[#07503d] text-white">
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Category
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Achievement
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {smallLocalTournamentRows.map((categoryRow) =>
                    categoryRow.achievements.map((achievement, index) => (
                      <tr
                        key={`${categoryRow.category}-${achievement.name}`}
                        className="odd:bg-white/[0.03] even:bg-white/[0.055]"
                      >
                        {index === 0 && (
                          <td
                            rowSpan={categoryRow.achievements.length}
                            className="w-44 border border-white/18 px-3 py-3 align-middle text-sm font-normal text-white sm:w-72 sm:px-5 sm:py-4 sm:text-base"
                          >
                            {categoryRow.category}
                          </td>
                        )}
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white sm:px-5 sm:py-4 sm:text-base">
                          {achievement.name}
                        </td>
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white/85 sm:px-5 sm:py-4 sm:text-base">
                          {achievement.points}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
              Big Local Tournament
            </h3>
            <p className="mt-5 text-sm font-light leading-7 sm:text-base">
              <strong className="font-normal text-white">Multiplier:</strong>{" "}
              1x{" "}
              <span className="mx-2 text-white/35">|</span>
              <strong className="font-normal text-white">
                Welcome Points:
              </strong>{" "}
              200 points
            </p>

            <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
              <table className="w-full min-w-[640px] border-collapse sm:min-w-[720px] border border-white/18 text-left">
                <thead>
                  <tr className="bg-[#07503d] text-white">
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Category
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Achievement
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bigLocalTournamentRows.map((categoryRow) =>
                    categoryRow.achievements.map((achievement, index) => (
                      <tr
                        key={`${categoryRow.category}-${achievement.name}`}
                        className="odd:bg-white/[0.03] even:bg-white/[0.055]"
                      >
                        {index === 0 && (
                          <td
                            rowSpan={categoryRow.achievements.length}
                            className="w-44 border border-white/18 px-3 py-3 align-middle text-sm font-normal text-white sm:w-72 sm:px-5 sm:py-4 sm:text-base"
                          >
                            {categoryRow.category}
                          </td>
                        )}
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white sm:px-5 sm:py-4 sm:text-base">
                          {achievement.name}
                        </td>
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white/85 sm:px-5 sm:py-4 sm:text-base">
                          {achievement.points}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
              National Tournament
            </h3>
            <p className="mt-5 text-sm font-light leading-7 sm:text-base">
              <strong className="font-normal text-white">Multiplier:</strong>{" "}
              2x <span className="mx-2 text-white/35">|</span>
              <strong className="font-normal text-white">
                Welcome Points:
              </strong>{" "}
              400 points
            </p>

            <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
              <table className="w-full min-w-[640px] border-collapse sm:min-w-[720px] border border-white/18 text-left">
                <thead>
                  <tr className="bg-[#07503d] text-white">
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Category
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Achievement
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nationalTournamentRows.map((categoryRow) =>
                    categoryRow.achievements.map((achievement, index) => (
                      <tr
                        key={`${categoryRow.category}-${achievement.name}`}
                        className="odd:bg-white/[0.03] even:bg-white/[0.055]"
                      >
                        {index === 0 && (
                          <td
                            rowSpan={categoryRow.achievements.length}
                            className="w-44 border border-white/18 px-3 py-3 align-middle text-sm font-normal text-white sm:w-72 sm:px-5 sm:py-4 sm:text-base"
                          >
                            {categoryRow.category}
                          </td>
                        )}
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white sm:px-5 sm:py-4 sm:text-base">
                          {achievement.name}
                        </td>
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white/85 sm:px-5 sm:py-4 sm:text-base">
                          {achievement.points}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
              International Tournament
            </h3>
            <p className="mt-5 text-sm font-light leading-7 sm:text-base">
              <strong className="font-normal text-white">Multiplier:</strong>{" "}
              4x <span className="mx-2 text-white/35">|</span>
              <strong className="font-normal text-white">
                Welcome Points:
              </strong>{" "}
              800 points
            </p>

            <div className="mt-6 overflow-x-auto pb-2 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
              <table className="w-full min-w-[640px] border-collapse sm:min-w-[720px] border border-white/18 text-left">
                <thead>
                  <tr className="bg-[#07503d] text-white">
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Category
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Achievement
                    </th>
                    <th className="border border-white/18 px-3 py-3 text-xs font-normal uppercase tracking-normal sm:px-5 sm:py-4 sm:text-sm">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {internationalTournamentRows.map((categoryRow) =>
                    categoryRow.achievements.map((achievement, index) => (
                      <tr
                        key={`${categoryRow.category}-${achievement.name}`}
                        className="odd:bg-white/[0.03] even:bg-white/[0.055]"
                      >
                        {index === 0 && (
                          <td
                            rowSpan={categoryRow.achievements.length}
                            className="w-44 border border-white/18 px-3 py-3 align-middle text-sm font-normal text-white sm:w-72 sm:px-5 sm:py-4 sm:text-base"
                          >
                            {categoryRow.category}
                          </td>
                        )}
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white sm:px-5 sm:py-4 sm:text-base">
                          {achievement.name}
                        </td>
                        <td className="border border-white/18 px-3 py-3 text-sm font-normal text-white/85 sm:px-5 sm:py-4 sm:text-base">
                          {achievement.points}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl text-white/68">
          <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl">
            Every Match Matters
          </h2>
          <p className="mt-6 text-sm font-light leading-7 sm:text-base">
            Whether you are joining a weekly session, completing a host-assigned
            challenge, or competing on the tournament stage, every eligible
            result brings you closer to the top.
          </p>
          <p className="mt-6 text-sm font-normal leading-7 text-white sm:text-base">
            Earn your points. Build your record. Rise through the PXDL PRO
            ranking.
          </p>
        </div>
      </section>
    </main>
  );
}

import Axios from "axios";
import type {
  GetGamesForSportResponse,
  GetGameFeedResponse,
  Game,
  GameState,
} from "../../mlb";
import type { NextApiRequest, NextApiResponse } from "next";
import format from "date-fns/format";

const AAASportId = 11;
const ICubsTeamId = 451;

const BASE_URL = "https://statsapi.mlb.com";

type EstimateInput = {
  currentInning: number;
  currentInningIndicator: "top" | "bottom";
  strikes: number;
  balls: number;
  outs: number;
};

export const estimateGameTimeCompletion = ({
  currentInning,
  currentInningIndicator,
  strikes,
  balls,
  outs,
}: EstimateInput): number => {
  // Constants (estimated average times)
  const TOTAL_INNINGS = 10; // 9 actual, but need to include the 9
  const AVG_TIME_PER_PITCH: number = 20; // milliseconds
  const AVG_TIME_PER_OUT: number = 30000; // milliseconds
  const AVG_TIME_PER_INNING: number = 180000;

  // Calculate time for pitches
  const pitchCount: number = strikes * 3 + balls;
  const pitchTime: number = pitchCount * AVG_TIME_PER_PITCH;

  // Calculate time for outs
  const outTime: number = outs * AVG_TIME_PER_OUT;

  // Calculate time for remaining innings
  let remainingInnings: number;
  if (currentInning === TOTAL_INNINGS && currentInningIndicator === "top") {
    remainingInnings = 1; // One inning remaining (bottom of the ninth)
  } else {
    remainingInnings = TOTAL_INNINGS - currentInning;
    if (currentInningIndicator === "bottom") {
      remainingInnings -= 0.5; // Subtract half-inning if it's the bottom
    }
  }
  const remainingInningsTime: number = remainingInnings * AVG_TIME_PER_INNING;

  // Calculate time for the current half-inning
  const elapsedInningTime: number =
    pitchTime + outTime - remainingInningsTime / 2;

  const remainingTime: number = Math.max(
    remainingInningsTime - elapsedInningTime,
    0
  );

  return remainingTime;
};

const getGamesForSport = async (): Promise<Game[]> => {
  const response = await Axios.get<GetGamesForSportResponse>(
    `${BASE_URL}/api/v1/schedule?sportId=${AAASportId}`
  );
  const { dates } = response.data;

  if (!dates.length) return [];

  const closestDate = dates[0];

  if (closestDate.date === format(new Date(), "yyyy-MM-dd"))
    return dates[0].games;

  return [];
};

const getScheduledGame = async (
  gameId: number
): Promise<GetGameFeedResponse> => {
  const response = await Axios.get<GetGameFeedResponse>(
    `${BASE_URL}/api/v1.1/game/${gameId}/feed/live`
  );

  return response.data;
};

export type GameInfo = {
  datetime: string;
  status: GameState;
  remainingTime: number;
  venue: string;
  homeTeam: {
    name: string;
    id: number;
  };
  awayTeam: {
    name: string;
    id: number;
  };
  play: {
    homeScore: number | null;
    awayScore: number | null;
    halfInning: "bottom" | "top";
    inning: number;
    count: {
      balls: number | null;
      strikes: number | null;
      outs: number | null;
    };
  };
};

export type GameDataResponse = {
  isTeamPlayingToday: boolean;
  isHome?: boolean;
  game?: GameInfo;
};

const findGameTodayByTeam =
  (teamId: number) =>
  (gameDate: Game): boolean => {
    const { away, home } = gameDate.teams;
    return away.team.id === teamId || home.team.id === teamId;
  };

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GameDataResponse>
): Promise<void> => {
  const scheduledGames = await getGamesForSport();
  const findByTeam = findGameTodayByTeam(ICubsTeamId);
  const game = scheduledGames.find(findByTeam);

  if (!game) {
    res.status(200).send({ isTeamPlayingToday: false });
    return;
  }

  const {
    gameData: { teams, datetime, venue, status },
    liveData: {
      plays: { currentPlay },
    },
  } = await getScheduledGame(game.gamePk);

  return res.status(200).send({
    isTeamPlayingToday: true,
    isHome: teams.home.id === ICubsTeamId,
    game: {
      remainingTime: currentPlay
        ? estimateGameTimeCompletion({
            currentInning: currentPlay.about.inning,
            currentInningIndicator: currentPlay.about.halfInning,
            strikes: currentPlay.count.strikes,
            balls: currentPlay.count.balls,
            outs: currentPlay.count.outs,
          })
        : 0,
      homeTeam: { name: teams.home.name, id: teams.home.id },
      awayTeam: { name: teams.away.name, id: teams.away.id },
      datetime: datetime.dateTime,
      venue: venue.name,
      status: status.detailedState,
      play: {
        awayScore: currentPlay?.result.awayScore ?? null,
        homeScore: currentPlay?.result.homeScore ?? null,
        count: {
          balls: currentPlay?.count.balls ?? null,
          outs: currentPlay?.count.outs ?? null,
          strikes: currentPlay?.count.strikes ?? null,
        },
        halfInning: currentPlay?.about.halfInning ?? "top",
        inning: currentPlay?.about.inning ?? 1,
      },
    },
  });
};

export default handler;

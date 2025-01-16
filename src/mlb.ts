type Team = {
  id: number;
  name: string;
  link: string;
};

type Venue = {
  id: number;
  name: string;
  link: string;
};

type LeagueRecord = {
  wins: number;
  losses: number;
  pct: string;
};

type GameStatus = {
  abstractGameState: "Live" | "Preview";
  detailedState: GameState;
};

export enum GameState {
  InProgress = "In Progress",
  Scheduled = "Scheduled",
  Final = "Final",
  GameOver = "Game Over",
  SuspendedRain = "Suspended: Rain"
}

export type Game = {
  gamePk: number;
  link: string;
  season: string;
  officialDate: string;
  gameDate: string;
  status: GameStatus;
  teams: {
    home: {
      leagueRecord: LeagueRecord;
      team: Team;
    };
    away: {
      leagueRecord: LeagueRecord;
      team: Team;
    };
  };
  venue: Venue;
  content: {
    link: string;
  };
  gameNumber: number;
  publicFacing: boolean;
};

export type GameDate = {
  date: string;
  games: Game[];
};

type LiveData = {
  plays: {
    currentPlay?: {
      result: {
        awayScore: number;
        homeScore: number;
      };
      about: {
        halfInning: "top" | "bottom";
        isTopInning: boolean;
        inning: number;
      };
      count: {
        balls: number;
        strikes: number;
        outs: number;
      };
    };
  };
};

export type GetGamesForSportResponse = {
  totalItems: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  dates: GameDate[];
};

export type GetGameFeedResponse = {
  gamePk: string;
  link: string;
  gameData: {
    teams: {
      home: {
        leagueRecord: LeagueRecord;
        name: string;
        id: number;
      };
      away: {
        leagueRecord: LeagueRecord;
        name: string;
        id: number;
      };
    };
    datetime: {
      dateTime: string;
      originalDate: string;
      dayNight: "day" | "night";
      time: string;
      ampm: "AM" | "PM";
    };
    venue: Venue;
    status: GameStatus;
  };
  liveData: LiveData;
};

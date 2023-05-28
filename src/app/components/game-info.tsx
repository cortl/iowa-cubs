import Image from "next/image";
import format from "date-fns/format";

import type { GameInfo as GameInfoProps } from "@/pages/api/game";
import { capitalize, getOrdinalNumber } from "../utils";
import { GameState } from "@/mlb";

type TeamProps = {
  name: string;
  id: number;
};

const Team: React.FC<TeamProps> = ({ name, id }) => {
  const src = `https://www.mlbstatic.com/team-logos/${id}.svg`;

  return (
    <div className="flex flex-col w-1/2">
      <Image
        className="mx-auto"
        src={src}
        width={100}
        height={100}
        alt={`${name} team logo`}
      />
      <span className="font-semibold text-lg">{name}</span>
    </div>
  );
};

type AboutGameProps = {
  halfInning: "top" | "bottom";
  inning: number;
  datetime: string;
  remainingTime: number;
  status: GameState;
};

const AboutGame: React.FC<AboutGameProps> = ({
  status,
  remainingTime,
  datetime,
  halfInning,
  inning,
}) => {
  const isGameInProgress = status === GameState.InProgress;

  if (isGameInProgress) {
    return (
      <div className="w-full text-center mt-5">
        <p>{`Estimated time remaining: ${remainingTime}ms`}</p>
        <p>
          {status} {format(new Date(datetime), "h:mmaa M/dd/yyyy")}
        </p>
        <p>{`${capitalize(halfInning)} of the ${getOrdinalNumber(inning)}`}</p>
      </div>
    );
  }

  return (
    <div className="w-full text-center mt-5">
      {status} {format(new Date(datetime), "h:mmaa M/dd/yyyy")}
    </div>
  );
};

type GameScoreProps = {
  homeScore: number | null;
  awayScore: number | null;
};

const GameScore: React.FC<GameScoreProps> = ({ homeScore, awayScore }) => {
  return (
    <div className="flex w-full mt-5">
      <div className="w-1/2 text-center border-r-2">
        <p className={"text-9xl"}>{homeScore ?? "-"}</p>
      </div>
      <div className="w-1/2 text-center">
        <p className={"text-9xl"}>{awayScore ?? "-"}</p>
      </div>
    </div>
  );
};

type GameStatProps = {
  label: string;
  value: number | null;
};

const GameStat: React.FC<GameStatProps> = ({ label, value }) => {
  return (
    <div className="w-1/3 text-center">
      <p className="font-semibold">{label}</p>
      <p>{value ?? "-"}</p>
    </div>
  );
};

type GameStatsProps = {
  balls: number | null;
  strikes: number | null;
  outs: number | null;
};

const GameStats: React.FC<GameStatsProps> = ({ balls, strikes, outs }) => {
  return (
    <div className="flex w-full mt-5">
      <GameStat label="Outs" value={outs} />
      <GameStat label="Balls" value={balls} />
      <GameStat label="Strikes" value={strikes} />
    </div>
  );
};

const GameInfo: React.FC<GameInfoProps> = ({
  datetime,
  homeTeam,
  awayTeam,
  venue,
  status,
  play,
  remainingTime,
}) => {
  return (
    <div className="mt-5 border-2 rounded-xl p-5 mx-2">
      <div className="w-full text-center border-b-2 pb-2 flex flex-row justify-items-center	">
        <Team {...homeTeam} />
        <Team {...awayTeam} />
      </div>

      <div className="w-full text-center pt-2">
        <p className="italic text-sm">{`@ ${venue}`}</p>
      </div>

      <AboutGame
        datetime={datetime}
        halfInning={play.halfInning}
        inning={play.inning}
        remainingTime={remainingTime}
        status={status}
      />

      <GameScore {...play} />
      <GameStats {...play.count} />
    </div>
  );
};

export { GameInfo };

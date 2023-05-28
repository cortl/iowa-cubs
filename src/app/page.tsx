"use client";
import type { GameDataResponse, GameInfo } from "@/pages/api/game";
import type { NextPage } from "next";
import Image from "next/image";
import * as React from "react";
import format from "date-fns/format";

type GameInfoProps = GameInfo;

const TEN_SECONDS = 10 * 1000;

const capitalize = (str: string): string => {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
};

const getOrdinalNumber = (number: number): string => {
  const suffixes: Record<number, string> = {
    1: "st",
    2: "nd",
    3: "rd",
  };

  const teenSuffix = "th";

  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  // Special case for numbers ending in 11, 12, and 13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return number + teenSuffix;
  }

  // Return the appropriate suffix based on the last digit
  const suffix = suffixes[lastDigit] || teenSuffix;
  return number + suffix;
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
        <div className="flex flex-col w-1/2">
          <Image
            className="mx-auto"
            src={`https://www.mlbstatic.com/team-logos/${homeTeam.id}.svg`}
            width={100}
            height={100}
            alt="Picture of the author"
          />
          <span className="font-semibold text-lg">{homeTeam.name}</span>
        </div>
        <div className="flex flex-col w-1/2">
          <Image
            className="mx-auto"
            src={`https://www.mlbstatic.com/team-logos/${awayTeam.id}.svg`}
            width={100}
            height={100}
            alt="Picture of the author"
          />
          <p className="font-semibold text-lg">{awayTeam.name}</p>
        </div>
      </div>
      <div className="w-full text-center pt-2">
        <p className="italic text-sm">{`@ ${venue}`}</p>
      </div>

      <div className="w-full text-center mt-5">
        {status !== "Final" && (
          // TODO: probably convert this to seconds or minutes or something
          <p>{`Estimated time remaining: ${remainingTime}ms`}</p>
        )}
        <p>
          {status} {format(new Date(datetime), "h:mmaa M/dd/yyyy")}
        </p>
        <p>{`${capitalize(play.halfInning)} of the ${getOrdinalNumber(
          play.inning
        )}`}</p>
      </div>

      <div className="flex w-full mt-5">
        <div className="w-1/2 text-center border-r-2">
          <p className={"text-9xl"}>{play.homeScore}</p>
        </div>
        <div className="w-1/2 text-center">
          <p className={"text-9xl"}>{play.awayScore}</p>
        </div>
      </div>

      <div className="flex w-full mt-5">
        <div className="w-1/3 text-center">
          <p className="font-semibold">{"Outs"}</p>
          <p>{play.count.outs}</p>
        </div>
        <div className="w-1/3 text-center">
          <p className="font-semibold">{"Balls"}</p>
          <p>{play.count.balls}</p>
        </div>
        <div className="w-1/3 text-center">
          <p className="font-semibold">{"Strikes"}</p>
          <p>{play.count.strikes}</p>
        </div>
      </div>
    </div>
  );
};

const MainPage: NextPage = () => {
  const [data, setData] = React.useState<GameDataResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState<Date | null>(null);
  const [shouldContinuallyUpdate, setShouldContinuallyUpdate] =
    React.useState(false);

  const fetchGameData = async () => {
    const response = await fetch("/api/game");
    const data = await response.json();
    setData(data);
    setLoading(false);
    setLastUpdatedAt(new Date());

    if (data.isTeamPlayingToday && data?.game.status !== "Final") {
      setShouldContinuallyUpdate(true);
    }
  };

  React.useEffect(() => {
    fetchGameData();
  }, []);

  React.useEffect(() => {
    if (shouldContinuallyUpdate) {
      const interval = setInterval(fetchGameData, TEN_SECONDS);

      return () => clearInterval(interval);
    }

    return () => {};
  }, [shouldContinuallyUpdate]);

  if (loading || !data) {
    return (
      <main>
        <div className="text-center mt-20">{"Loading..."}</div>
      </main>
    );
  }

  if (!data.game) {
    return (
      <main>
        <div className="text-center mt-20">{"No game today 😭"}</div>
      </main>
    );
  }

  return (
    <main>
      <div className="w-full md:w-1/2 mx-auto">
        <GameInfo {...data.game} />
        {lastUpdatedAt && (
          <p className="w-full text-center italic text-sm mt-2">
            {`Last updated at ${format(lastUpdatedAt, "h:mm:ssaa M/dd/yyyy")}`}
          </p>
        )}
      </div>
    </main>
  );
};

export default MainPage;

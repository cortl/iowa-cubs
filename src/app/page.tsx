"use client";
import * as React from "react";
import type { NextPage } from "next";
import format from "date-fns/format";

import type { GameDataResponse } from "@/pages/api/game";
import { GameInfo } from "./components/game-info";

const TEN_SECONDS = 10 * 1000;

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

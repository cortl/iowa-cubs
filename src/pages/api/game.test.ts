import { estimateGameTimeCompletion } from "./game";

describe("Estimate Game Time", () => {
  test("should estimate a full game left", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 1,
        currentInningIndicator: "top",
        strikes: 0,
        balls: 0,
        outs: 0,
      })
    ).toBe(2430000);
  });

  test("should estimate a half inning left", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 9,
        currentInningIndicator: "bottom",
        strikes: 0,
        balls: 0,
        outs: 0,
      })
    ).toBe(135000);
  });

  test("should estimate a full inning left", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 9,
        currentInningIndicator: "top",
        strikes: 0,
        balls: 0,
        outs: 0,
      })
    ).toBe(270000);
  });

  test("should estimate two fill innings left", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 8,
        currentInningIndicator: "top",
        strikes: 0,
        balls: 0,
        outs: 0,
      })
    ).toBe(540000);
  });

  test("should have less time if there is a single out", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 9,
        currentInningIndicator: "bottom",
        strikes: 0,
        balls: 0,
        outs: 1,
      })
    ).toBe(105000);
  });

  test("should have less time if there are two outs", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 9,
        currentInningIndicator: "bottom",
        strikes: 0,
        balls: 0,
        outs: 2,
      })
    ).toBe(75000);
  });

  test("should have less time if there are two outs and a single strike", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 9,
        currentInningIndicator: "bottom",
        strikes: 1,
        balls: 0,
        outs: 2,
      })
    ).toBe(74940);
  });

  test("should have less time if there are two outs and two strikes", () => {
    expect(
      estimateGameTimeCompletion({
        currentInning: 9,
        currentInningIndicator: "bottom",
        strikes: 2,
        balls: 0,
        outs: 2,
      })
    ).toBe(74880);
  });
});

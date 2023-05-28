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

export { capitalize, getOrdinalNumber };

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const pitchClassNotation = {
  0: "C",
  1: "C# / Db",
  2: "D",
  3: "D# / Eb",
  4: "E",
  5: "F",
  6: "F# / Gb",
  7: "G",
  8: "G# / Ab",
  9: "A",
  10: "A# / Bb",
  11: "B",
};

export const camelotNotationMajor = {
  0: "8B",
  1: "3B",
  2: "10B",
  3: "5B",
  4: "12B",
  5: "7B",
  6: "2B",
  7: "9B",
  8: "4B",
  9: "11B",
  10: "6B",
  11: "1B",
};

export const camelotNotationMinor = {
  0: "5A",
  1: "12A",
  2: "7A",
  3: "2A",
  4: "9A",
  5: "4A",
  6: "11A",
  7: "6A",
  8: "1A",
  9: "8A",
  10: "3A",
  11: "10A",
};

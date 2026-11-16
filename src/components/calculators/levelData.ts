// The maths behind the Discord levelling calculator (/levels), which used to be
// a separate page on Netlify (TripSit/LevelCalculator).

import { parseAmount } from "./amounts";

export const MAX_LEVEL = 1000;
// For messages and for voice hours
const MAX_ACTIVITY = 1_000_000;
// TripBot gives 15 to 25 XP for a message, but only for one message a minute.
// In a voice channel it gives the same every 2 minutes, while you're unmuted
// with other people there. So these are averages.
const XP_PER_MESSAGE = 20;
const XP_PER_VOICE_MINUTE = 10;
const XP_PER_VOICE_HOUR = XP_PER_VOICE_MINUTE * 60;

// The XP it takes to get from this level to the next one, as in TripBot's
// expForNextLevel (src/global/utils/experience.ts).
export function xpForNextLevel(level: number): number {
  return 5 * level ** 2 + 50 * level + 100;
}

// TOTAL_XP[level] is the total XP that reaches each level from 0 to MAX_LEVEL.
// Like TripBot's getTotalLevel, everyone starts at level 0, so level 1 takes
// xpForNextLevel(0) = 100 XP. (The repo's old index.html started from
// xpForNextLevel(1), a level too high; the live Netlify page didn't.)
const TOTAL_XP = [0];
for (let level = 1; level <= MAX_LEVEL; level += 1) {
  TOTAL_XP.push(TOTAL_XP[level - 1] + xpForNextLevel(level - 1));
}

// For a whole-number level from 0 to MAX_LEVEL
export function totalXpForLevel(level: number): number {
  return TOTAL_XP[level];
}

// The highest level a total amount of XP reaches.
export function levelForXp(xp: number): number {
  return TOTAL_XP.findLastIndex((total) => total <= xp);
}

// Minutes as "1d 7h 58m", rounded up to the next minute.
export function formatDuration(minutes: number): string {
  const total = Math.ceil(minutes);
  const units: [number, string][] = [
    [Math.floor(total / 1440), "d"],
    [Math.floor((total % 1440) / 60), "h"],
    [total % 60, "m"],
  ];
  const parts = units
    .filter(([value]) => value > 0)
    .map(([value, unit]) => `${value}${unit}`);
  return parts.length > 0 ? parts.join(" ") : "0m";
}

// Typing filters: levels, XP and messages are whole numbers. Voice hours may
// have one decimal point (or comma); anything after a second one is dropped.
export function keepDigits(text: string, maxLength: number): string {
  return text.replaceAll(/\D/g, "").slice(0, maxLength);
}

export function keepDecimal(text: string, maxLength: number): string {
  // "1.2.3" splits into ["1", ".", "2", ".", "3"]; the first three parts stay.
  return text
    .replaceAll(/[^\d.,]/g, "")
    .split(/([.,])/)
    .slice(0, 3)
    .join("")
    .slice(0, maxLength);
}

// A blank or unreadable box (just "." say) counts as 0.
function read(text: string): number {
  const value = parseAmount(text);
  return Number.isNaN(value) ? 0 : value;
}

export type StartFrom = "level" | "activity";

export type LevelInputs = {
  startFrom: StartFrom;
  currentLevel: string;
  // XP already earned towards the next level, as /levels shows it (optional)
  levelXp: string;
  messages: string;
  voiceHours: string;
  desiredLevel: string;
};

// An amount of XP, and roughly what it takes to earn it with messages alone
// (one a minute, at best) or with voice chat alone.
export type XpAmount = { xp: number; messages: number; voiceMinutes: number };

export type LevelResult = {
  // Why the results are zero, when there's a problem with the input
  warning?: string;
  // When working from activity: the XP so far and the level it reaches
  estimate?: { xp: number; level: number };
  // The levels to mark on the chart (0 means none)
  currentLevel: number;
  desiredLevel: number;
  left: XpAmount;
  total: XpAmount;
};

function amount(xp: number): XpAmount {
  return {
    xp,
    messages: Math.ceil(xp / XP_PER_MESSAGE),
    voiceMinutes: xp / XP_PER_VOICE_MINUTE,
  };
}

const NOTHING = amount(0);

function warning(text: string): LevelResult {
  return {
    warning: text,
    currentLevel: 0,
    desiredLevel: 0,
    left: NOTHING,
    total: NOTHING,
  };
}

export function calculateLevels(inputs: LevelInputs): LevelResult {
  const fromActivity = inputs.startFrom === "activity";
  const enteredLevel = read(inputs.currentLevel);
  const levelXp = read(inputs.levelXp);
  const messages = read(inputs.messages);
  const voiceHours = read(inputs.voiceHours);
  const desiredLevel = read(inputs.desiredLevel);

  if (desiredLevel > MAX_LEVEL) {
    return warning(`The desired level can't be over ${MAX_LEVEL}.`);
  }
  if (!fromActivity && enteredLevel > MAX_LEVEL) {
    return warning(`Your current level can't be over ${MAX_LEVEL}.`);
  }
  if (fromActivity && (messages > MAX_ACTIVITY || voiceHours > MAX_ACTIVITY)) {
    return warning("Messages and voice hours can't be over 1 million.");
  }

  const startXp = fromActivity
    ? Math.round(messages * XP_PER_MESSAGE + voiceHours * XP_PER_VOICE_HOUR)
    : // TripBot levels you up before the XP in a level reaches the next one.
      totalXpForLevel(enteredLevel) +
      Math.min(levelXp, xpForNextLevel(enteredLevel));
  const currentLevel = fromActivity ? levelForXp(startXp) : enteredLevel;
  const estimate = fromActivity
    ? { xp: startXp, level: currentLevel }
    : undefined;
  const nothingYet = {
    estimate,
    currentLevel,
    desiredLevel: 0,
    left: NOTHING,
    total: NOTHING,
  };

  // Nothing to work out until there's a level to aim for
  if (inputs.desiredLevel.trim() === "") {
    return nothingYet;
  }
  const targetXp = totalXpForLevel(desiredLevel);
  const xpLeft = targetXp - startXp;
  if (xpLeft < 0) {
    return {
      ...nothingYet,
      warning: "You already have more XP than that level needs.",
    };
  }
  return {
    estimate,
    currentLevel,
    desiredLevel,
    left: amount(xpLeft),
    total: amount(targetXp),
  };
}

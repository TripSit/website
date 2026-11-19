import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ApexOptions } from "apexcharts";
import LevelsPage from "@/pages/levels";
import {
  calculateLevels,
  formatDuration,
  keepDecimal,
  keepDigits,
  levelForXp,
  totalXpForLevel,
  xpForNextLevel,
  type LevelInputs,
} from "@/components/calculators/levelData";
import {
  chartLevels,
  levelChart,
} from "@/components/calculators/LevelCalculator";

// The chart only loads in a browser, so a stand-in shows what it was given.
jest.mock(
  "next/dynamic",
  () => () =>
    function Chart({
      series,
      options,
    }: {
      series: { data: unknown[] }[];
      options: ApexOptions;
    }) {
      return (
        <>
          <output aria-label="Levels on the chart">
            {series[0].data.length}
          </output>
          <output aria-label="Chart markers">
            {options.annotations?.points
              ?.map((point) => point.label?.text)
              .join(", ")}
          </output>
        </>
      );
    },
);

// The expected totals and levels come from TripBot's own levelling code
// (getTotalLevel in src/global/utils/experience.ts), run on the same numbers.
// The XP-in-level and time results match the live Netlify page for the same input.

test("uses TripBot's XP formula, starting from level 0", () => {
  expect(xpForNextLevel(0)).toBe(100);
  expect(xpForNextLevel(1)).toBe(155);
  expect(xpForNextLevel(10)).toBe(1100);
  expect(totalXpForLevel(0)).toBe(0);
  expect(totalXpForLevel(1)).toBe(100);
  expect(totalXpForLevel(10)).toBe(4675);
  expect(totalXpForLevel(100)).toBe(1899250);
  expect(totalXpForLevel(1000)).toBe(1689242500);
});

test("finds the level an amount of XP reaches", () => {
  expect(levelForXp(0)).toBe(0);
  expect(levelForXp(99)).toBe(0);
  expect(levelForXp(100)).toBe(1);
  expect(levelForXp(3200)).toBe(8);
  expect(levelForXp(4674)).toBe(9);
  expect(levelForXp(4675)).toBe(10);
  expect(levelForXp(Number.MAX_SAFE_INTEGER)).toBe(1000);
});

test("shows minutes as days, hours and minutes, rounded up", () => {
  expect(formatDuration(0)).toBe("0m");
  expect(formatDuration(0.2)).toBe("1m");
  expect(formatDuration(59)).toBe("59m");
  expect(formatDuration(60)).toBe("1h");
  expect(formatDuration(959)).toBe("15h 59m");
  expect(formatDuration(1500)).toBe("1d 1h");
  expect(formatDuration(1917.5)).toBe("1d 7h 58m");
});

test("keeps only digits, and at most one decimal point for hours", () => {
  expect(keepDigits("1a2b3", 4)).toBe("123");
  expect(keepDigits("123456", 4)).toBe("1234");
  expect(keepDigits("-5", 4)).toBe("5");
  expect(keepDecimal("2,5 h", 9)).toBe("2,5");
  expect(keepDecimal("1.2.3", 9)).toBe("1.2");
  expect(keepDecimal("abc", 9)).toBe("");
  expect(keepDecimal("12345678.9", 9)).toBe("12345678.");
});

const fromLevel = (
  currentLevel: string,
  desiredLevel: string,
  levelXp = "",
): LevelInputs => ({
  startFrom: "level",
  currentLevel,
  levelXp,
  messages: "",
  voiceHours: "",
  desiredLevel,
});

const fromActivity = (
  messages: string,
  voiceHours: string,
  desiredLevel: string,
): LevelInputs => ({
  startFrom: "activity",
  currentLevel: "",
  levelXp: "",
  messages,
  voiceHours,
  desiredLevel,
});

test("works out the XP left and the total", () => {
  expect(calculateLevels(fromLevel("10", "20"))).toEqual({
    estimate: undefined,
    currentLevel: 10,
    desiredLevel: 20,
    left: { xp: 19175, messages: 959, voiceMinutes: 1917.5 },
    total: { xp: 23850, messages: 1193, voiceMinutes: 2385 },
  });
  expect(calculateLevels(fromLevel("", "1")).left.xp).toBe(100);
  expect(calculateLevels(fromLevel("57", "58")).left.xp).toBe(19195);
  expect(calculateLevels(fromLevel("999", "1000"))).toMatchObject({
    left: { xp: 5040055, messages: 252003 },
    total: { xp: 1689242500, messages: 84462125 },
  });
  expect(calculateLevels(fromLevel("12", "12")).left.xp).toBe(0);
});

test("takes off the XP already earned in the current level, up to a level's worth", () => {
  expect(calculateLevels(fromLevel("10", "20", "500")).left.xp).toBe(18675);
  // Level 10 to 11 takes 1,100 XP, so more than that counts as 1,100
  expect(calculateLevels(fromLevel("10", "20", "99999")).left.xp).toBe(18075);
  expect(calculateLevels(fromLevel("10", "20", "99999")).total.xp).toBe(23850);
  // It only counts when working from a level
  expect(
    calculateLevels({ ...fromActivity("100", "", "20"), levelXp: "500" })
      .estimate?.xp,
  ).toBe(2000);
});

test("estimates the starting XP from messages and voice hours", () => {
  expect(calculateLevels(fromActivity("100", "2", "20"))).toEqual({
    estimate: { xp: 3200, level: 8 },
    currentLevel: 8,
    desiredLevel: 20,
    left: { xp: 20650, messages: 1033, voiceMinutes: 2065 },
    total: { xp: 23850, messages: 1193, voiceMinutes: 2385 },
  });
  expect(calculateLevels(fromActivity("50000", "300", "100")).left.xp).toBe(
    719250,
  );
  // Part hours count too, with a comma or a point
  expect(calculateLevels(fromActivity("", "0,5", "")).estimate?.xp).toBe(300);
  // A box holding just a decimal point counts as 0
  expect(calculateLevels(fromActivity("10", ".", "")).estimate?.xp).toBe(200);
});

test("names the start-from choice by the label on screen", () => {
  render(<LevelsPage />);
  // Its accessible name used to be a different phrase from the visible label.
  const group = screen.getByRole("group", { name: "Start from:" });
  expect(
    within(group).getByRole("button", { name: "My level" }),
  ).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(
    within(group).getByRole("button", { name: "My messages and voice time" }),
  );
  expect(
    within(group).getByRole("button", { name: "My messages and voice time" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("waits for a level to aim for before working anything out", () => {
  expect(calculateLevels(fromLevel("5", ""))).toEqual({
    estimate: undefined,
    currentLevel: 5,
    desiredLevel: 0,
    left: { xp: 0, messages: 0, voiceMinutes: 0 },
    total: { xp: 0, messages: 0, voiceMinutes: 0 },
  });
});

test("keeps the old limits of level 1000 and a million messages or hours", () => {
  const nothing = { xp: 0, messages: 0, voiceMinutes: 0 };
  expect(calculateLevels(fromLevel("5", "1001"))).toEqual({
    warning: "The desired level can't be over 1000.",
    currentLevel: 0,
    desiredLevel: 0,
    left: nothing,
    total: nothing,
  });
  expect(calculateLevels(fromLevel("1001", "5")).warning).toBe(
    "Your current level can't be over 1000.",
  );
  expect(calculateLevels(fromActivity("1000001", "", "20")).warning).toBe(
    "Messages and voice hours can't be over 1 million.",
  );
  expect(calculateLevels(fromActivity("", "1000000.5", "20")).warning).toBe(
    "Messages and voice hours can't be over 1 million.",
  );
  // The hidden level box doesn't count when working from activity
  expect(
    calculateLevels({ ...fromActivity("1", "", "2"), currentLevel: "5000" })
      .warning,
  ).toBeUndefined();
  expect(
    calculateLevels(fromActivity("1000000", "1000000", "1000")).left.xp,
  ).toBe(1689242500 - 620000000);
});

test("says so when the desired level is already reached", () => {
  expect(calculateLevels(fromLevel("20", "10"))).toEqual({
    warning: "You already have more XP than that level needs.",
    estimate: undefined,
    currentLevel: 20,
    desiredLevel: 0,
    left: { xp: 0, messages: 0, voiceMinutes: 0 },
    total: { xp: 0, messages: 0, voiceMinutes: 0 },
  });
});

test("charts levels 0 to 100, or up to the highest marked level", () => {
  expect(chartLevels(0, 0)).toBe(100);
  expect(chartLevels(5, 50)).toBe(100);
  expect(chartLevels(141, 3)).toBe(150);
  expect(chartLevels(0, 999)).toBe(1000);
  expect(chartLevels(1000, 1000)).toBe(1000);
});

test("marks the current and desired levels on the chart", () => {
  const { series, options } = levelChart(10, 20);
  expect(series[0].data).toHaveLength(101);
  expect(series[0].data[0]).toEqual([0, 0]);
  expect(series[0].data[10]).toEqual([10, 4675]);
  expect(options.annotations?.points).toEqual([
    expect.objectContaining({
      x: 10,
      y: 4675,
      label: expect.objectContaining({ text: "Now: 10" }),
    }),
    expect.objectContaining({
      x: 20,
      y: 23850,
      label: expect.objectContaining({ text: "Goal: 20" }),
    }),
  ]);
  expect(levelChart(0, 0).options.annotations?.points).toEqual([]);
  // Five level ticks instead of ten on a phone
  expect(options.responsive).toEqual([
    { breakpoint: 640, options: { xaxis: { tickAmount: 5 } } },
  ]);
});

test("labels the chart's axes and tooltip", () => {
  const { options } = levelChart(0, 0);
  const xaxis = options.xaxis as {
    labels: { formatter: (value: string) => string };
  };
  const yaxis = options.yaxis as {
    labels: { formatter: (value: number) => string };
  };
  const tooltip = options.tooltip as {
    x: { formatter: (value: number) => string };
    y: { formatter: (value: number | null) => string };
  };
  expect(xaxis.labels.formatter("40.00000001")).toBe("40");
  expect(yaxis.labels.formatter(1899250)).toBe("1.9M");
  expect(tooltip.x.formatter(57)).toBe("Level 57");
  expect(tooltip.y.formatter(405275)).toBe("405,275 XP");
  expect(tooltip.y.formatter(null)).toBe("");
});

function type(label: string, value: string) {
  fireEvent.change(screen.getByRole("textbox", { name: label }), {
    target: { value },
  });
}

const shown = (label: string) => screen.getByRole("status", { name: label });

test("has the page heading, the Discord link and the credit", () => {
  render(<LevelsPage />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Discord Levelling Calculator",
    }),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: "TripSit Discord" })).toHaveAttribute(
    "href",
    "https://discord.gg/tripsit",
  );
  expect(screen.getByText(/Hipperooni/)).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Total XP for each level" }),
  ).toBeVisible();
});

test("shows the XP, messages and voice hours as levels are typed", () => {
  render(<LevelsPage />);
  expect(shown("XP still needed")).toHaveTextContent("0");
  expect(shown("Levels on the chart")).toHaveTextContent("101");

  type("Your current level", "10");
  type("Level you want to reach", "20");

  const left = within(screen.getByRole("region", { name: "Still needed" }));
  expect(
    left.getByRole("status", { name: "XP still needed" }),
  ).toHaveTextContent("19,175");
  expect(shown("Messages still needed")).toHaveTextContent("959");
  expect(shown("Chat time still needed")).toHaveTextContent("15h 59m");
  expect(shown("Voice time still needed")).toHaveTextContent("1d 7h 58m");
  expect(shown("XP in total")).toHaveTextContent("23,850");
  expect(shown("Messages in total")).toHaveTextContent("1,193");
  expect(shown("Chat time in total")).toHaveTextContent("19h 53m");
  expect(shown("Voice time in total")).toHaveTextContent("1d 15h 45m");
  expect(shown("Chart markers")).toHaveTextContent("Now: 10, Goal: 20");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();

  // Levels past 100 stretch the chart
  type("Level you want to reach", "250");
  expect(shown("Levels on the chart")).toHaveTextContent("251");

  // XP already earned in level 10
  type("Level you want to reach", "20");
  type("XP already earned in this level", "500 xp");
  expect(
    screen.getByRole("textbox", { name: "XP already earned in this level" }),
  ).toHaveValue("500");
  expect(shown("XP still needed")).toHaveTextContent("18,675");
  type("XP already earned in this level", "123456789");
  expect(
    screen.getByRole("textbox", { name: "XP already earned in this level" }),
  ).toHaveValue("1234567");
  expect(shown("XP still needed")).toHaveTextContent("18,075");
});

test("drops anything but digits from the level boxes", () => {
  render(<LevelsPage />);
  type("Your current level", "1a2-");
  expect(
    screen.getByRole("textbox", { name: "Your current level" }),
  ).toHaveValue("12");
  type("Level you want to reach", "123456");
  expect(
    screen.getByRole("textbox", { name: "Level you want to reach" }),
  ).toHaveValue("1234");
  expect(screen.getByRole("alert")).toHaveTextContent(
    "The desired level can't be over 1000.",
  );
  expect(shown("XP still needed")).toHaveTextContent("0");
  expect(shown("Chart markers").textContent).toBe("");
});

test("switches to messages and voice hours, and back", () => {
  render(<LevelsPage />);
  const byLevel = screen.getByRole("button", { name: "My level" });
  const byActivity = screen.getByRole("button", {
    name: "My messages and voice time",
  });
  expect(byLevel).toHaveAttribute("aria-pressed", "true");

  fireEvent.click(byActivity);
  expect(byActivity).toHaveAttribute("aria-pressed", "true");
  expect(byLevel).toHaveAttribute("aria-pressed", "false");
  expect(
    screen.queryByRole("textbox", { name: "Your current level" }),
  ).not.toBeInTheDocument();

  type("Messages sent", "100 msgs");
  type("Hours in voice chat", "2.0.5");
  expect(screen.getByRole("textbox", { name: "Messages sent" })).toHaveValue(
    "100",
  );
  expect(
    screen.getByRole("textbox", { name: "Hours in voice chat" }),
  ).toHaveValue("2.0");
  expect(shown("Estimated XP so far")).toHaveTextContent("3,200");
  expect(shown("Estimated current level")).toHaveTextContent("8");

  type("Level you want to reach", "20");
  expect(shown("XP still needed")).toHaveTextContent("20,650");
  expect(shown("Chart markers")).toHaveTextContent("Now: 8, Goal: 20");

  type("Messages sent", "99999999");
  expect(screen.getByRole("textbox", { name: "Messages sent" })).toHaveValue(
    "9999999",
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Messages and voice hours can't be over 1 million.",
  );

  fireEvent.click(byLevel);
  expect(
    screen.getByRole("textbox", { name: "Your current level" }),
  ).toBeVisible();
  expect(
    screen.queryByRole("status", { name: "Estimated XP so far" }),
  ).not.toBeInTheDocument();
});

test("warns when the desired level is below the current one", () => {
  render(<LevelsPage />);
  type("Your current level", "20");
  type("Level you want to reach", "10");
  expect(screen.getByRole("alert")).toHaveTextContent(
    "You already have more XP than that level needs.",
  );
  expect(shown("XP in total")).toHaveTextContent("0");
  expect(shown("Chart markers")).toHaveTextContent("Now: 20");
});

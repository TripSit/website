import { act, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { useCountUp } from "react-countup";
import DiscordMembers from "../DiscordMembers";
import Counter from "../Counter";
import Ghost from "../Ghost";

jest.mock("axios");
jest.mock("react-countup", () => ({ useCountUp: jest.fn() }));

test("uses animation defaults when only the ending count is supplied", () => {
  jest.mocked(useCountUp).mockReturnValue({
    start: jest.fn(),
    pauseResume: jest.fn(),
    reset: jest.fn(),
    update: jest.fn(),
    getCountUp: jest.fn(),
  });
  render(
    <Counter
      data={{ endNum: 25 } as React.ComponentProps<typeof Counter>["data"]}
    />,
  );
  expect(screen.getByText("0")).toBeVisible();
  expect(useCountUp).toHaveBeenLastCalledWith(
    expect.objectContaining({ start: 0, end: 25, duration: 5, delay: 1 }),
  );
});

test("loads the Discord member count and starts its counter on the animation event", async () => {
  jest.mocked(axios.get).mockResolvedValue({
    data: { approximate_member_count: 12345 },
  });
  const start = jest.fn();
  jest.mocked(useCountUp).mockReturnValue({
    start,
    pauseResume: jest.fn(),
    reset: jest.fn(),
    update: jest.fn(),
    getCountUp: jest.fn(),
  });
  render(
    <div className="count-box" role="region" aria-label="Discord count">
      <DiscordMembers />
    </div>,
  );
  expect(screen.getByText("0")).toBeVisible();

  await act(async () => {});
  expect(axios.get).toHaveBeenCalledWith(
    "https://discord.com/api/v10/guilds/179641883222474752?with_counts=true",
    expect.any(Object),
  );
  expect(useCountUp).toHaveBeenCalledWith(
    expect.objectContaining({
      start: 0,
      end: 12345,
      duration: 4,
      delay: 1,
      separator: ",",
    }),
  );
  fireEvent(
    screen.getByRole("region", { name: "Discord count" }),
    new Event("aos:in"),
  );
  expect(start).toHaveBeenCalledTimes(1);
});

test("fades the hero after inactivity and restores it on interaction", () => {
  jest.useFakeTimers();
  try {
    render(
      <>
        <Ghost />
        <section id="hero" aria-label="Hero" />
        <button id="animationButton">Animations</button>
      </>,
    );
    const hero = screen.getByRole("region", { name: "Hero" });
    const animations = screen.getByRole("button", { name: "Animations" });
    act(() => jest.advanceTimersByTime(10));
    fireEvent.mouseMove(document);
    act(() => jest.advanceTimersByTime(10000));
    expect(hero).toHaveStyle({ opacity: "0" });
    expect(animations).toHaveStyle({ opacity: "0" });
    fireEvent.keyDown(document);
    expect(Number(hero.style.opacity)).toBeGreaterThan(0);
    expect(Number(animations.style.opacity)).toBeGreaterThan(0);
  } finally {
    jest.useRealTimers();
  }
});

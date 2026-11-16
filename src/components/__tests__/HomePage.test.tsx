import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import Home, { getStaticProps } from "@/pages";
import { getDiscordStats } from "@/utils/discordStats";
import drugs from "tripsit_drug_db/drugs.json";
import { useCountUp } from "react-countup";

jest.mock("@/utils/discordStats");
jest.mock("@heroui/react", () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    Accordion: Object.assign(Wrapper, {
      Item: ({
        children,
      }: {
        children: (state: { isExpanded: boolean }) => ReactNode;
      }) => children({ isExpanded: false }),
      Heading: Wrapper,
      Trigger: Wrapper,
      Panel: Wrapper,
      Body: Wrapper,
    }),
    Dropdown: Object.assign(Wrapper, { Trigger: Wrapper, Popover: () => null }),
    cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
  };
});
jest.mock("swiper/modules", () => ({}));
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock("next/dynamic", () => () => () => null);
jest.mock("react-countup", () => ({
  useCountUp: jest.fn(() => ({ start: jest.fn() })),
}));

const discord = { memberCount: 4000, presenceCount: 1234 };

test.each([
  { stats: discord, seconds: 300 },
  { stats: null, seconds: 30 },
])(
  "uses a $seconds second revalidation interval",
  async ({ stats, seconds }) => {
    jest.mocked(getDiscordStats).mockResolvedValue(stats);
    await expect(getStaticProps()).resolves.toEqual({
      props: { discord: stats, drugCount: Object.keys(drugs).length },
      revalidate: seconds,
    });
  },
);

test("links to trip sitting and shows online counts when available", () => {
  const { rerender } = render(<Home discord={discord} drugCount={555} />);
  expect(
    screen.getByRole("link", { name: /i want to talk to a trip sitter/i }),
  ).toHaveAttribute("href", "/webchat");
  expect(screen.getByText("1,234")).toBeVisible();
  expect(screen.getByRole("heading", { name: "About Us" })).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 3, name: "Reflect App" }).closest("a"),
  ).toHaveAttribute("href", "/reflect");
  rerender(<Home discord={null} drugCount={555} />);
  expect(screen.queryByText(/people are here right now/i)).toBeNull();
});

test("counts the drug database instead of showing fixed numbers", async () => {
  jest.mocked(getDiscordStats).mockResolvedValue(discord);
  const { props } = await getStaticProps();
  expect(props.drugCount).toBeGreaterThan(500);

  render(<Home discord={discord} drugCount={props.drugCount} />);
  expect(screen.getByText("Drugs in our Database")).toBeVisible();
  expect(useCountUp).toHaveBeenCalledWith(
    expect.objectContaining({ end: props.drugCount }),
  );
  // Reddit doesn't answer without OAuth, so the old hard-coded count is gone.
  expect(screen.queryByText("Subreddit Subscribers")).toBeNull();
});

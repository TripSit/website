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

test("sends every combo link to /combo, not the old combo.tripsit.me page", () => {
  const { container } = render(<Home discord={discord} drugCount={555} />);
  const hrefs = [...container.querySelectorAll("a")].map((a) =>
    a.getAttribute("href"),
  );
  expect(hrefs.filter((href) => href?.includes("combo.tripsit.me"))).toEqual(
    [],
  );
  for (const name of [
    /compare drug combos/i,
    /check drug combinations/i,
    /drug combination chart/i,
  ]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute(
      "href",
      "/combo",
    );
  }
  // The footer's "Combo App" link and the Resources card both point there too.
  expect(
    screen
      .getAllByRole("link", { name: /combo app/i })
      .map((link) => link.getAttribute("href")),
  ).toEqual(["/combo", "/combo"]);
});

test("links nowhere that is gone or private (#296)", () => {
  const { container } = render(<Home discord={discord} drugCount={555} />);
  const hrefs = [...container.querySelectorAll("a")].map(
    (a) => a.getAttribute("href") ?? "",
  );
  // Checked 2026-11-08 and 2026-11-16: these return 404 or are private repositories.
  const dead = [
    "tripbot.info",
    "element.tripsit.me",
    "github.com/TripSit/tripbot-website",
    "github.com/TripSit/webchat",
    "github.com/TripSit/tripsit-mobile",
  ];
  expect(
    hrefs.filter((href) => dead.some((url) => href.includes(url))),
  ).toEqual([]);
  expect(
    screen.getByRole("link", { name: /TripSit Discord Bot/i }),
  ).toHaveAttribute("href", "https://github.com/TripSit/TripBot");
  expect(screen.getByRole("link", { name: "Webchat" })).toHaveAttribute(
    "href",
    "https://github.com/TripSit/website/blob/main/src/components/Webchat.tsx",
  );
  const phoneApp = screen.getByRole("heading", { name: "Phone App" });
  expect(phoneApp.nextElementSibling?.querySelector("a")).toHaveAttribute(
    "href",
    "/reflect",
  );
});

test("footer links go straight to the site's pages, with no staff-only portal (#296)", () => {
  const { container } = render(<Home discord={discord} drugCount={555} />);
  const footer = container.querySelector("footer");
  if (!footer) {
    throw new Error("The homepage has no footer");
  }
  const hrefs = [...footer.querySelectorAll("a")].map(
    (a) => a.getAttribute("href") ?? "",
  );
  // drugs.tripsit.me and chat.tripsit.me only redirect to these pages, and home.tripsit.me
  // is the team's Google sign-in.
  expect(
    hrefs.filter((href) =>
      ["drugs.tripsit.me", "chat.tripsit.me", "home.tripsit.me"].some((host) =>
        href.includes(host),
      ),
    ),
  ).toEqual([]);
  const link = (name: string) =>
    [...footer.querySelectorAll("a")].find((a) => a.textContent === name);
  expect(link("Factsheets")).toHaveAttribute("href", "/factsheets");
  expect(link("Live Chat")).toHaveAttribute("href", "/webchat");
  expect(link("Team Portal")).toBeUndefined();
});

test("draws its icons as inline SVG, with no icon font left (#285)", () => {
  const { container } = render(<Home discord={discord} drugCount={555} />);
  expect(
    container.querySelector('[class*="ri-"], i.bi, i.bx, [class*="bx-"]'),
  ).toBeNull();
  expect(
    container.querySelectorAll('svg[data-icon="bx-check-double"]').length,
  ).toBeGreaterThan(3);
});

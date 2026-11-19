import { render, screen } from "@testing-library/react";
import type { GetServerSidePropsContext } from "next";
import AppealReviewPage, {
  getServerSideProps,
} from "@/pages/dashboard/appeals";
import { getServerSideProps as dashboardProps } from "@/pages/dashboard";
import Dashboard from "@/pages/dashboard";
import { writeStaffCookie } from "@/server/staff";

jest.mock("@/components/staff/AppealReview", () => ({
  __esModule: true,
  default: () => <div>Review queue</div>,
}));

const environment = { ...process.env };

beforeEach(() => {
  Object.assign(process.env, {
    STAFF_SITE_ORIGIN: "https://site.example",
    STAFF_KEYCLOAK_ISSUER: "https://auth.example/realms/TripSit",
    STAFF_KEYCLOAK_CLIENT_ID: "staff",
    STAFF_KEYCLOAK_CLIENT_SECRET: "secret",
    STAFF_COOKIE_SECRET: "ab".repeat(32),
    TRIPBOT_API_URL: "https://bot.example",
  });
  global.fetch = jest.fn();
});
afterEach(() => {
  process.env = { ...environment };
});

function sessionCookies() {
  const headers: Record<string, unknown> = {};
  writeStaffCookie(
    { setHeader: (k: string, v: unknown) => (headers[k] = v) } as never,
    "session",
    { accessToken: "token" },
    300,
  );
  const cookie = String(headers["Set-Cookie"]).split(";")[0];
  const split = cookie.indexOf("=");
  return { [cookie.slice(0, split)]: cookie.slice(split + 1) };
}

async function load(
  query: Record<string, string> = {},
  cookies: Record<string, string> = {},
) {
  const res = { setHeader: jest.fn(), statusCode: 200 };
  const result = await getServerSideProps({
    req: { cookies },
    res,
    query,
  } as unknown as GetServerSidePropsContext);
  return { res, props: (result as { props: unknown }).props };
}

describe("staff appeal review page", () => {
  it("asks for sign-in without a session and is never cached or indexed", async () => {
    const { res, props } = await load();
    expect(props).toEqual({ access: "login", name: "" });
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "private, no-store",
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "X-Robots-Tag",
      "noindex, nofollow",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows the sign-in result from the callback without calling TripBot", async () => {
    const { props } = await load({ signin: "denied" });
    expect(props).toEqual({ access: "denied", name: "" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("ignores an unknown sign-in result", async () => {
    const { props } = await load({ signin: "authorized" });
    expect(props).toEqual({ access: "login", name: "" });
  });

  it("admits a reviewer TripBot confirms", async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ canManageAppeals: true, displayName: "Moonbear" }),
    } as Response);
    const { props } = await load({}, sessionCookies());
    expect(props).toEqual({ access: "authorized", name: "Moonbear" });
  });

  it("uses a generic name when TripBot sends none", async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ canManageAppeals: true }),
    } as Response);
    const { props } = await load({}, sessionCookies());
    expect(props).toEqual({ access: "authorized", name: "Staff member" });
  });

  it("denies a member without permission", async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ canManageAppeals: false }),
    } as Response);
    expect((await load({}, sessionCookies())).props).toEqual({
      access: "denied",
      name: "",
    });
    jest
      .mocked(fetch)
      .mockResolvedValue({ ok: false, status: 403 } as Response);
    const denied = await load({}, sessionCookies());
    expect(denied.props).toEqual({ access: "denied", name: "" });
    expect(denied.res.statusCode).toBe(403);
  });

  it("reports an unconfigured or failing service as unavailable", async () => {
    delete process.env.TRIPBOT_API_URL;
    const unconfigured = await load();
    expect(unconfigured.props).toEqual({ access: "unavailable", name: "" });
    expect(unconfigured.res.statusCode).toBe(503);
    process.env.TRIPBOT_API_URL = "https://bot.example";
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError("bad json");
      },
    } as unknown as Response);
    const broken = await load({}, sessionCookies());
    expect(broken.props).toEqual({ access: "unavailable", name: "" });
    expect(broken.res.statusCode).toBe(503);
  });

  it("renders the queue and a sign-out form for a reviewer", () => {
    render(<AppealReviewPage access="authorized" name="Moonbear" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Ban appeal review" }),
    ).toBeVisible();
    expect(screen.getByText(/Signed in as Moonbear/)).toBeVisible();
    expect(screen.getByText("Review queue")).toBeVisible();
    expect(
      screen
        .getByRole("button", { name: "Sign out of staff review" })
        .closest("form"),
    ).toHaveAttribute("action", "/api/staff/auth/logout");
  });

  it.each([
    ["login", "Sign in with your staff account to review appeals.", true],
    [
      "denied",
      "Your linked Discord account does not have permission to review appeals.",
      true,
    ],
    [
      "expired",
      "Staff sign-in expired or was cancelled. Please try again.",
      true,
    ],
    [
      "unavailable",
      "Staff review is unavailable. Please try again later.",
      false,
    ],
  ] as const)("explains the %s state", (access, message, canSignIn) => {
    render(<AppealReviewPage access={access} name="" />);
    expect(screen.getByText(message)).toBeVisible();
    expect(screen.queryByText("Review queue")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign in with Keycloak" }) !== null,
    ).toBe(canSignIn);
  });
});

describe("staff dashboard index", () => {
  it("redirects to the appeal queue", async () => {
    await expect(
      dashboardProps({} as GetServerSidePropsContext),
    ).resolves.toEqual({
      redirect: { destination: "/dashboard/appeals", permanent: false },
    });
    expect(render(<Dashboard />).container).toBeEmptyDOMElement();
  });
});

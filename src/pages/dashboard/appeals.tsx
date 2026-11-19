import type { GetServerSideProps } from "next";
import NextHead from "next/head";
import Link from "next/link";
import AppealReview from "@/components/staff/AppealReview";
import { solidButton } from "@/components/buttonClasses";
import styles from "@/components/staff/staff.module.css";
import { fontVariables } from "@/components/fonts";

type Access = "authorized" | "login" | "denied" | "unavailable" | "expired";
type Props = { access: Access; name: string };

// Set by /api/staff/auth/callback when sign-in does not finish.
const signinResults = new Set<Access>(["denied", "expired", "unavailable"]);

function accessFor(status: number): Access {
  if (status === 401) return "login";
  if (status === 403) return "denied";
  return "unavailable";
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  query,
}) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const signin = String(query.signin) as Access;
  if (signinResults.has(signin)) {
    return { props: { access: signin, name: "" } };
  }
  // Loaded here so the server-only module never reaches the page bundle.
  const { staffToken, tripbotRequest, StaffError } =
    await import("@/server/staff");
  try {
    // Permission is checked live on every load, so a revoked reviewer loses access at once.
    const staff = await tripbotRequest(staffToken(req), "/session");
    if (staff.canManageAppeals !== true)
      return { props: { access: "denied", name: "" } };
    const name =
      typeof staff.displayName === "string"
        ? staff.displayName
        : "Staff member";
    return { props: { access: "authorized", name } };
  } catch (error) {
    const status = error instanceof StaffError ? error.status : 503;
    res.statusCode = status === 401 ? 200 : status;
    return { props: { access: accessFor(status), name: "" } };
  }
};

const accessMessages = {
  login: "Sign in with your staff account to review appeals.",
  denied:
    "Your linked Discord account does not have permission to review appeals.",
  unavailable: "Staff review is unavailable. Please try again later.",
  expired: "Staff sign-in expired or was cancelled. Please try again.",
};

export default function AppealReviewPage({ access, name }: Readonly<Props>) {
  return (
    <div
      data-bs-theme="dark"
      className={`${fontVariables} min-h-screen bg-night font-body text-ink`}
    >
      <NextHead>
        <title>Appeal review — TripSit staff</title>
        <meta name="robots" content="noindex,nofollow" />
      </NextHead>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-[20px] py-[20px]">
          <Link href="/" className="text-cyan">
            ← TripSit
          </Link>
          <span className="text-sm text-mute">Staff · Appeal review</span>
          {access === "authorized" && (
            <form method="post" action="/api/staff/auth/logout">
              <button type="submit" className={styles.button}>
                Sign out of staff review
              </button>
            </form>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-[20px] py-10">
        <h1 className="font-display text-3xl">Ban appeal review</h1>
        {access === "authorized" ? (
          <>
            <p className="mb-6 text-mute">
              Signed in as {name}. Review member responses and record a
              decision.
            </p>
            <AppealReview />
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <p role={access === "login" ? undefined : "alert"}>
              {accessMessages[access]}
            </p>
            {access !== "unavailable" && (
              <form method="get" action="/api/staff/auth/login">
                <button
                  type="submit"
                  className={`${solidButton} ${styles.primary}`}
                >
                  Sign in with Keycloak
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

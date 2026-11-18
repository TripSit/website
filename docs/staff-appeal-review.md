# Staff appeal review

The staff area is served at `/dashboard/appeals` (`/dashboard` redirects there).
It adapts Warden's appeal cards and decision workflow to this site's Pages Router
and TripSit styling. The public `/appeal` login and submission flow are unchanged.

## Configuration

Deploy the accompanying TripBot changes before enabling the website staff area.
No Prisma schema change or migration is required.

Create a **separate confidential Keycloak client** for website staff sign-in:
enable the standard authorization code flow and PKCE S256, disable direct access
grants, and register exactly:

```text
https://<website-host>/api/staff/auth/callback
```

Set these **runtime, server-only** variables on the website service:

| Variable | Value |
| --- | --- |
| `STAFF_SITE_ORIGIN` | The exact public website origin; never derived from the incoming Host header |
| `STAFF_KEYCLOAK_ISSUER` | Keycloak realm issuer, including `/realms/TripSit` |
| `STAFF_KEYCLOAK_CLIENT_ID` | The confidential staff client ID |
| `STAFF_KEYCLOAK_CLIENT_SECRET` | The staff client secret |
| `STAFF_COOKIE_SECRET` | A dedicated random 32-byte key encoded as 64 hex characters |
| `TRIPBOT_API_URL` | TripBot server origin, without `/api/v2` |

Generate a cookie key with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
Use the same key on all website instances; rotating it invalidates staff sessions.
Do not put any of these settings into `NEXT_PUBLIC_*` or Docker build arguments.

Service URLs require HTTPS. During development, HTTP is permitted only for
`localhost` and `127.0.0.1`. The local Compose service forwards these variables
from the shell or Compose's `.env`. Production deployments must pass them to the
running container through their deployment secret/environment configuration.

TripBot uses its existing `KEYCLOAK_URL`, linked Discord identity admin credentials
(`KEYCLOAK_BAN_APPEALS_ADMIN_CLIENT_ID` / `KEYCLOAK_BAN_APPEALS_ADMIN_CLIENT_SECRET`),
and `DISCORD_GUILD_ID`. The new staff client must use the same TripSit realm that
TripBot's existing token validation uses. No shared bot token or client-supplied
reviewer ID is used.

## Reverse proxy routing

TripBot's existing Traefik router captures `/api` on the website hostname.
The website Compose file adds a higher-priority `website-staff` router for
exactly `/api/staff` and `/api/staff/*`, pointing to `website-svc`. Carry this
rule into the production deployment too. Leave `/api/v2/*` routed to TripBot.
Without this exception, staff login callbacks and browser review requests reach
the wrong service. `TRIPBOT_API_URL` should point directly at the TripBot/API
hostname; server-side requests use `/api/v2/appeals/staff`.

## Authorization and sessions

- TripBot validates the Keycloak access token and resolves the linked Discord ID.
- Every staff read and decision fetches current guild membership and requires
  Discord's `BanMembers` permission (including administrators). There is no demo,
  trial moderator, or realm-role fallback. Missing identity, missing membership,
  and permission service failures deny access.
- The website uses state plus PKCE for login and an encrypted HttpOnly,
  SameSite=Lax cookie. HTTPS cookies use the `__Host-` prefix. Access tokens never
  reach page props, JavaScript storage, or client-visible API bodies.
- Sessions expire with the access token, capped at one hour. There is no refresh
  token storage; sign in again through Keycloak SSO when a session expires.
  Local sign-out clears the staff cookie; it does not end other Keycloak sessions.
- Mutations and local sign-out require the configured exact Origin. Staff HTML
  and API responses are private/no-store; the staff pages are marked noindex.
- The encrypted cookie has a browser-size limit. Keep the staff client's token
  claims small; tokens that cannot fit are rejected rather than silently dropped.

## TripBot API

All endpoints require a Keycloak bearer token and live staff permission:

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/v2/appeals/staff/session` | `{ canManageAppeals: true, displayName }` |
| GET | `/api/v2/appeals/staff?status=RECEIVED&page=0` | `{ appeals, hasMore }`; 25 rows per page |
| POST | `/api/v2/appeals/staff/:appealId` | `{ decision, responseMessage }` → `{ success: true }` |

Status is one of RECEIVED, ACCEPTED, DENIED. Page is zero-based. Results retain
TripBot's snake_case fields with only `discord_id` and `username` flattened from
the associated user. Email, tokens, internal user records, and mod-thread IDs
are not returned. Responses are required and limited to 2000 characters.

Listing and decisions are scoped to the configured guild. Only the latest,
pending appeal can be decided through the website; stale or already-decided
appeals return 409. Existing Discord denial overrides remain available there.

A transaction locks the appeal row and writes both the decision and a
`user_actions` APPEAL_ACCEPT/APPEAL_REJECT audit record attributed to the verified
reviewer. Accepting also removes the Discord ban. An unban failure aborts the
database transaction; an already-removed ban is safe to retry. Discord buttons
use a conditional status update so a concurrent review cannot overwrite a
website decision.

Discord and PostgreSQL cannot share a transaction: if Discord succeeds but a
database commit or HTTP response subsequently fails, refresh before retrying.
The retry tolerates Discord's Unknown Ban response. Reviewers should inspect the
queue and Discord when a network failure leaves the outcome uncertain.

The website deliberately does not post into Discord mod threads or send DMs;
the saved response appears through the existing public appeal status endpoint.
Reviewer audit attribution lives in TripBot's existing user_actions records.
Per-process limits allow 120 staff requests and 20 decisions per reviewer per
minute; the existing global API limit also applies. Scale-out deployments need
a shared rate-limit store.

## Verification before rollout

Run website lint, Jest tests, and a production build; run TripBot's staff endpoint,
query, and Discord appeal regression tests and TypeScript check. Unit tests mock
Keycloak, PostgreSQL, and Discord. Before production, test the configured login
and a disposable guild: ordinary user denied, staff admitted, revoked permission
denied on the next request, accept/unban, deny, and duplicate/concurrent decisions.
No live moderation actions are needed to run the automated suite.


import type { NextApiRequest, NextApiResponse } from "next";
import {
  assertStaffOrigin,
  StaffError,
  staffFailure,
  staffToken,
  tripbotRequest,
} from "@/server/staff";

const statuses = new Set(["RECEIVED", "ACCEPTED", "DENIED"]);
const decisions = new Set(["ACCEPTED", "DENIED"]);
const appealId =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

// Only the queue filter TripBot understands is forwarded; anything else is rejected here.
function queueQuery(query: NextApiRequest["query"]) {
  const { status = "RECEIVED", page = "0" } = query;
  if (typeof status !== "string" || !statuses.has(status)) {
    throw new StaffError(400, "Invalid queue filter.");
  }
  if (typeof page !== "string" || !/^\d{1,5}$/.test(page)) {
    throw new StaffError(400, "Invalid queue filter.");
  }
  return `?${new URLSearchParams({ status, page })}`;
}

// The reviewer comes from the session token in TripBot, so only these two fields are sent.
function decisionBody(body: unknown) {
  const { decision, responseMessage } = (body ?? {}) as Record<string, unknown>;
  const valid =
    typeof decision === "string" &&
    decisions.has(decision) &&
    typeof responseMessage === "string" &&
    responseMessage.trim() !== "" &&
    responseMessage.length <= 2000;
  if (!valid) {
    throw new StaffError(
      400,
      "Choose a decision and enter a response of up to 2000 characters.",
    );
  }
  return JSON.stringify({ decision, responseMessage: responseMessage.trim() });
}

function decide(req: NextApiRequest, token: string, id: string) {
  assertStaffOrigin(req);
  if (!appealId.test(id)) throw new StaffError(400, "Invalid appeal ID.");
  return tripbotRequest(token, `/${id}`, {
    method: "POST",
    body: decisionBody(req.body),
  });
}

function route(req: NextApiRequest, token: string, path: string[]) {
  const [resource, id] = path;
  if (path.length === 1 && req.method === "GET") {
    if (resource === "session") return tripbotRequest(token, "/session");
    if (resource === "appeals")
      return tripbotRequest(token, queueQuery(req.query));
  }
  if (path.length === 2 && resource === "appeals" && req.method === "POST") {
    return decide(req, token, id);
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "private, no-store");
  const path = req.query.path;
  if (!Array.isArray(path)) return res.status(404).end();
  try {
    const result = route(req, staffToken(req), path);
    if (result) return res.json(await result);
    res.setHeader("Allow", path.length === 2 ? "POST" : "GET");
    return res.status(405).end();
  } catch (error) {
    return staffFailure(res, error);
  }
}

export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };

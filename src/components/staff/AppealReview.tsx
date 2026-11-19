import { useRef, useState } from "react";
import { solidButton } from "../buttonClasses";
import styles from "./staff.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Status = "RECEIVED" | "ACCEPTED" | "DENIED";
type Decision = Exclude<Status, "RECEIVED">;
type DecideFn = (
  id: string,
  decision: Decision,
  response: string,
) => Promise<void>;
export interface ReviewAppeal {
  id: string;
  discord_id: string | null;
  username: string | null;
  appeal_number: number | null;
  reason: string;
  solution: string;
  future: string;
  extra: string | null;
  status: Status;
  created_at: string;
  reminded_at: string | null;
  decided_at: string | null;
  response_message: string | null;
}
const labels: Record<Status, string> = {
  RECEIVED: "Pending",
  ACCEPTED: "Accepted",
  DENIED: "Denied",
};
const confirmPrompts: Record<Decision, string> = {
  ACCEPTED: "Accept this appeal and unban this member?",
  DENIED: "Deny this appeal?",
};
const decidedNotices: Record<Decision, string> = {
  ACCEPTED: "Appeal accepted and member unbanned.",
  DENIED: "Appeal denied.",
};
const button = styles.button;
const primary = `${solidButton} ${styles.primary}`;

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`/api/staff/${path}`, {
    ...init,
    cache: "no-store",
  });
  // Error responses such as 405 have no body, so a missing one falls back to a message.
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body.error ?? "Unable to load staff review.");
  return body;
}

function Answers({ appeal }: Readonly<{ appeal: ReviewAppeal }>) {
  const questions = [
    ["Why were you banned?", appeal.reason],
    ["Steps taken to make amends", appeal.solution],
    ["How will you avoid repeating the behavior?", appeal.future],
    ["Additional information", appeal.extra],
  ];
  return (
    <dl className="my-4 grid gap-4">
      {questions
        .filter(([, answer]) => answer)
        .map(([question, answer]) => (
          <div key={question}>
            <dt className="mb-1 text-sm font-semibold text-ink">{question}</dt>
            <dd className="m-0 whitespace-pre-wrap break-words text-mute">
              {answer}
            </dd>
          </div>
        ))}
    </dl>
  );
}

function ConfirmDecision({
  decision,
  busy,
  onConfirm,
  onCancel,
}: Readonly<{
  decision: Decision;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>) {
  return (
    <div className="mt-3 rounded-lg border border-line p-3">
      <p>{confirmPrompts[decision]}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={primary}
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "Saving…" : "Confirm decision"}
        </button>
        <button
          type="button"
          className={button}
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function DecisionForm({
  appeal,
  busy,
  onDecide,
}: Readonly<{ appeal: ReviewAppeal; busy: boolean; onDecide: DecideFn }>) {
  const [response, setResponse] = useState("");
  const [confirm, setConfirm] = useState<Decision | null>(null);
  const empty = !response.trim();

  async function submit(decision: Decision) {
    await onDecide(appeal.id, decision, response);
    setConfirm(null);
  }

  return (
    <div className="border-t border-line pt-4">
      <label
        htmlFor={`response-${appeal.id}`}
        className="mb-2 block font-semibold"
      >
        Response to the member
      </label>
      <textarea
        id={`response-${appeal.id}`}
        className={styles.field}
        rows={3}
        maxLength={2000}
        value={response}
        disabled={busy}
        onChange={(event) => {
          setResponse(event.target.value);
          setConfirm(null);
        }}
        aria-describedby={`limit-${appeal.id}`}
      />
      <p id={`limit-${appeal.id}`} className="mt-1 text-sm text-mute">
        {response.length}/2000 characters. This response is visible on the
        member’s appeal page.
      </p>
      {confirm && (
        <ConfirmDecision
          decision={confirm}
          busy={busy}
          onConfirm={() => void submit(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {!confirm && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={primary}
            disabled={busy || empty || !appeal.discord_id}
            onClick={() => setConfirm("ACCEPTED")}
          >
            Accept &amp; unban
          </button>
          <button
            type="button"
            className={button}
            disabled={busy || empty}
            onClick={() => setConfirm("DENIED")}
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewedNote({ appeal }: Readonly<{ appeal: ReviewAppeal }>) {
  const decided = appeal.decided_at
    ? new Date(appeal.decided_at).toLocaleString()
    : "previously";
  return (
    <div className="border-t border-line pt-3">
      <p className="text-sm text-mute">Reviewed {decided}</p>
      <p className="whitespace-pre-wrap break-words">
        {appeal.response_message}
      </p>
    </div>
  );
}

function AppealCard({
  appeal,
  busy,
  onDecide,
}: Readonly<{ appeal: ReviewAppeal; busy: boolean; onDecide: DecideFn }>) {
  const member = appeal.username ?? appeal.discord_id ?? "unknown member";
  return (
    <article
      className="rounded-2xl border border-line bg-surface p-[20px]"
      aria-label={`Appeal from ${member}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl text-ink">
            {appeal.username ?? "Discord member"}
          </h2>
          <p className="text-sm text-mute">
            {appeal.discord_id ?? "No linked Discord account"} · Appeal{" "}
            {appeal.appeal_number ?? "—"}
            {" · "}
            <time dateTime={appeal.created_at}>
              {new Date(appeal.created_at).toLocaleString()}
            </time>
          </p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 text-sm">
          {labels[appeal.status]}
        </span>
      </div>
      <Answers appeal={appeal} />
      {appeal.status === "RECEIVED" ? (
        <DecisionForm appeal={appeal} busy={busy} onDecide={onDecide} />
      ) : (
        <ReviewedNote appeal={appeal} />
      )}
    </article>
  );
}

function QueueError({ message }: Readonly<{ message: string }>) {
  return (
    <div role="alert">
      <p>{message}</p>
      <form method="get" action="/api/staff/auth/login">
        <button type="submit" className={button}>
          Sign in again
        </button>
      </form>
    </div>
  );
}

export default function AppealReview() {
  const [status, setStatus] = useState<Status>("RECEIVED");
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(
    null,
  );
  const client = useQueryClient();
  const queue = useQuery<{ appeals: ReviewAppeal[]; hasMore: boolean }>({
    queryKey: ["staff-appeals", status, page],
    queryFn: ({ signal }) =>
      request(`appeals?status=${status}&page=${page}`, { signal }),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const waiting = busy || queue.isFetching;

  async function decide(
    id: string,
    decision: Decision,
    responseMessage: string,
  ) {
    // A ref, not state, so a double click cannot send a second decision before re-render.
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setNotice(null);
    try {
      await request(`appeals/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, responseMessage }),
      });
      setNotice({ error: false, text: decidedNotices[decision] });
    } catch (error) {
      setNotice({ error: true, text: (error as Error).message });
    } finally {
      await client.invalidateQueries({ queryKey: ["staff-appeals"] });
      lock.current = false;
      setBusy(false);
    }
  }

  return (
    <section className={styles.queue} aria-label="Appeal review queue">
      <div className="mb-[20px] flex flex-wrap items-center justify-between gap-3">
        <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
          <legend className="sr-only">Filter appeals</legend>
          {(Object.keys(labels) as Status[]).map((value) => (
            <button
              type="button"
              key={value}
              className={status === value ? "btn btn-primary" : button}
              disabled={busy}
              aria-pressed={status === value}
              onClick={() => {
                setStatus(value);
                setPage(0);
                setNotice(null);
              }}
            >
              {labels[value]}
            </button>
          ))}
        </fieldset>
        <button
          type="button"
          className={button}
          disabled={waiting}
          onClick={() => void queue.refetch()}
        >
          Refresh queue
        </button>
      </div>
      {notice?.error && (
        <p role="alert" className="text-amber">
          {notice.text}
        </p>
      )}
      {notice && !notice.error && (
        <output className="block text-cyan">{notice.text}</output>
      )}
      {queue.isPending && <output className="block">Loading appeals…</output>}
      {queue.isError && <QueueError message={queue.error.message} />}
      {queue.isSuccess && (
        <>
          {queue.data.appeals.length === 0 && (
            <p>No {labels[status].toLowerCase()} appeals on this page.</p>
          )}
          <div className="grid gap-5" aria-busy={waiting}>
            {queue.data.appeals.map((appeal) => (
              <AppealCard
                key={appeal.id}
                appeal={appeal}
                busy={waiting}
                onDecide={decide}
              />
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              className={button}
              disabled={waiting || page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>Page {page + 1}</span>
            <button
              type="button"
              className={button}
              disabled={waiting || !queue.data.hasMore}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

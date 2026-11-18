import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppealReview from "../staff/AppealReview";

const appeal = {
  id: "11111111-1111-4111-8111-111111111111",
  discord_id: "123",
  username: "Example member",
  appeal_number: 1,
  reason: "Reason text",
  solution: "Made amends",
  future: "Future plan",
  extra: null,
  status: "RECEIVED",
  created_at: "2026-01-01T00:00:00.000Z",
  reminded_at: null,
  decided_at: null,
  response_message: null,
};
function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AppealReview />
    </QueryClientProvider>,
  );
}
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ appeals: [appeal], hasMore: false }),
  });
});

it("requires a response and confirmation before sending a decision", async () => {
  const user = userEvent.setup();
  mount();
  const accept = await screen.findByRole("button", { name: "Accept & unban" });
  expect(accept).toBeDisabled();
  await user.type(
    screen.getByLabelText("Response to the member"),
    "Welcome back.",
  );
  await user.click(accept);
  expect(fetch).toHaveBeenCalledTimes(1);
  jest
    .mocked(fetch)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
    .mockResolvedValue({
      ok: true,
      json: async () => ({ appeals: [], hasMore: false }),
    } as Response);
  await user.click(screen.getByRole("button", { name: "Confirm decision" }));
  await screen.findByText("Appeal accepted and member unbanned.");
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining(appeal.id),
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        decision: "ACCEPTED",
        responseMessage: "Welcome back.",
      }),
    }),
  );
});

it("shows errors without rendering private rows and offers reauthentication", async () => {
  jest.mocked(fetch).mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Permission revoked." }),
  } as Response);
  mount();
  await screen.findByText("Permission revoked.");
  expect(screen.queryByText("Reason text")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Sign in again" }).closest("form"),
  ).toHaveAttribute("action", "/api/staff/auth/login");
});

it("filters and paginates using real API queries", async () => {
  mount();
  await screen.findByText("Reason text");
  fireEvent.click(screen.getByRole("button", { name: "Denied" }));
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      "/api/staff/appeals?status=DENIED&page=0",
      expect.any(Object),
    ),
  );
});

it("shows pending and empty states", async () => {
  jest.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ appeals: [], hasMore: false }),
  } as Response);
  mount();
  expect(screen.getByText("Loading appeals…")).toBeInTheDocument();
  await screen.findByText("No pending appeals on this page.");
});

it("cancels a decision and denies after confirming", async () => {
  const user = userEvent.setup();
  mount();
  await user.type(
    await screen.findByLabelText("Response to the member"),
    "Not this time.",
  );
  await user.click(screen.getByRole("button", { name: "Deny" }));
  expect(screen.getByText("Deny this appeal?")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByText("Deny this appeal?")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Deny" }));
  await user.type(screen.getByLabelText("Response to the member"), "!");
  expect(screen.queryByText("Deny this appeal?")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Deny" }));
  jest.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  } as Response);
  await user.click(screen.getByRole("button", { name: "Confirm decision" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Appeal denied.");
});

it("shows why a decision failed and keeps the appeal", async () => {
  const user = userEvent.setup();
  mount();
  await user.type(
    await screen.findByLabelText("Response to the member"),
    "Welcome back.",
  );
  await user.click(screen.getByRole("button", { name: "Accept & unban" }));
  jest.mocked(fetch).mockResolvedValueOnce({
    ok: false,
    json: async () => {
      throw new SyntaxError("empty body");
    },
  } as unknown as Response);
  await user.click(screen.getByRole("button", { name: "Confirm decision" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to load staff review.",
  );
  expect(screen.getByText("Reason text")).toBeVisible();
});

it("cannot accept an appeal without a linked Discord account", async () => {
  jest.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({
      appeals: [{ ...appeal, discord_id: null, username: null }],
      hasMore: false,
    }),
  } as Response);
  const user = userEvent.setup();
  mount();
  expect(await screen.findByText("Discord member")).toBeVisible();
  expect(screen.getByText(/No linked Discord account/)).toBeVisible();
  await user.type(screen.getByLabelText("Response to the member"), "Hi");
  expect(screen.getByRole("button", { name: "Accept & unban" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Deny" })).toBeEnabled();
});

it("shows the saved response on reviewed appeals", async () => {
  jest.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({
      appeals: [
        {
          ...appeal,
          id: "a",
          status: "ACCEPTED",
          extra: "Extra context",
          decided_at: "2026-01-02T00:00:00.000Z",
          response_message: "Welcome back.",
        },
        {
          ...appeal,
          id: "b",
          status: "DENIED",
          appeal_number: null,
          response_message: "No.",
        },
      ],
      hasMore: false,
    }),
  } as Response);
  mount();
  expect(await screen.findByText("Welcome back.")).toBeVisible();
  expect(screen.getByText("Extra context")).toBeVisible();
  expect(screen.getByText("Reviewed previously")).toBeVisible();
  expect(screen.getByText(/Appeal —/)).toBeVisible();
  expect(
    screen.queryByLabelText("Response to the member"),
  ).not.toBeInTheDocument();
});

it("pages forward and back and refreshes the queue", async () => {
  jest.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ appeals: [appeal], hasMore: true }),
  } as Response);
  const user = userEvent.setup();
  mount();
  await screen.findByText("Reason text");
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(await screen.findByText("Page 2")).toBeVisible();
  expect(fetch).toHaveBeenLastCalledWith(
    "/api/staff/appeals?status=RECEIVED&page=1",
    expect.any(Object),
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled(),
  );
  await user.click(screen.getByRole("button", { name: "Previous" }));
  expect(await screen.findByText("Page 1")).toBeVisible();
  const calls = jest.mocked(fetch).mock.calls.length;
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Refresh queue" })).toBeEnabled(),
  );
  await user.click(screen.getByRole("button", { name: "Refresh queue" }));
  await waitFor(() =>
    expect(jest.mocked(fetch).mock.calls.length).toBeGreaterThan(calls),
  );
});

it("ignores a second confirm while a decision is saving", async () => {
  let finish: (value: Response) => void = () => {};
  const user = userEvent.setup();
  mount();
  await user.type(
    await screen.findByLabelText("Response to the member"),
    "Welcome back.",
  );
  await user.click(screen.getByRole("button", { name: "Accept & unban" }));
  jest.mocked(fetch).mockImplementationOnce(
    () =>
      new Promise<Response>((resolve) => {
        finish = resolve;
      }),
  );
  const confirm = screen.getByRole("button", { name: "Confirm decision" });
  fireEvent.click(confirm);
  fireEvent.click(confirm);
  expect(
    jest.mocked(fetch).mock.calls.filter(([, init]) => init?.method === "POST"),
  ).toHaveLength(1);
  finish({ ok: true, json: async () => ({ success: true }) } as Response);
  await screen.findByText("Appeal accepted and member unbanned.");
});

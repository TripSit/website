import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AppealPage from "@/pages/appeal";

test.each([
  ["server", "An error occurred while submitting your appeal"],
  ["network", "Error submitting appeal."],
  ["expired", "Session expired."],
  ["empty", "Failed to submit appeal"],
])("shows a dismissible submission error for %s", async (failure, message) => {
  sessionStorage.setItem("kc_token", validToken());
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply({}, false));
  render(<AppealPage />);
  const submit = await screen.findByRole("button", { name: "Submit Appeal" });
  for (const label of [
    /why you were banned/i,
    /make amends/i,
    /avoid repeating/i,
  ]) {
    fireEvent.change(screen.getByRole("textbox", { name: label }), {
      target: { value: "Answer" },
    });
  }
  if (failure === "expired") sessionStorage.clear();
  else if (failure === "network")
    fetchMock.mockRejectedValueOnce(new Error("Offline"));
  else if (failure === "server")
    fetchMock.mockResolvedValueOnce(
      reply({ error: "Failed to create appeal due to a server error" }, false),
    );
  else fetchMock.mockResolvedValueOnce(reply({}, false));
  fireEvent.click(submit);
  expect(await screen.findByText(message, { exact: false })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByText(message, { exact: false })).toBeNull();
});

test("renders appeal status when optional details are absent", async () => {
  sessionStorage.setItem("kc_token", validToken());
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply({ id: "pending" }));
  render(<AppealPage />);
  expect(await screen.findByText("Under Review")).toBeVisible();
  expect(screen.getByText(/unknown/i)).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "View Your Appeal Content" }),
  ).toBeNull();
});

test("keeps the session when checking ban status fails", async () => {
  const access = validToken();
  sessionStorage.setItem("kc_token", access);
  window.history.replaceState({}, "", "/appeal?code=stale");
  fetchMock.mockResolvedValueOnce(reply({}, false));
  render(<AppealPage />);
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  expect(window.location.search).toBe("");
  expect(sessionStorage.getItem("kc_token")).toBe(access);
});

test.each(["DENIED", "RECEIVED"])(
  "applies the shorter development waiting period to %s",
  async (status) => {
    const environment = process.env as Record<string, string | undefined>;
    const original = environment.NODE_ENV;
    environment.NODE_ENV = "development";
    try {
      sessionStorage.setItem("kc_token", validToken());
      fetchMock
        .mockResolvedValueOnce(reply({ banned: true }))
        .mockResolvedValueOnce(
          reply({
            id: "appeal",
            status,
            decided_at: daysAgo(1),
            created_at:
              status === "RECEIVED"
                ? new Date(Date.now() - 60000).toISOString()
                : undefined,
          }),
        );
      render(<AppealPage />);
      if (status === "DENIED") {
        expect(
          await screen.findByRole("heading", { name: "Submit New Ban Appeal" }),
        ).toBeVisible();
        expect(screen.getByText("Unknown")).toBeVisible();
      } else {
        expect(
          await screen.findByRole("button", { name: "Send Reminder" }),
        ).toBeEnabled();
      }
    } finally {
      environment.NODE_ENV = original;
    }
  },
);

jest.mock("@/components/Header", () => () => null);
jest.mock("@/components/Footer", () => () => null);
jest.mock("@/utils/keycloak", () => ({
  getLoginUrl: () => "https://auth.example.test/login",
}));

const fetchMock = jest.fn();
const originalFetch = global.fetch;

test("keeps a still-valid token without repeating the ban check on each interval", async () => {
  jest.useFakeTimers();
  const access = validToken();
  sessionStorage.setItem("kc_token", access);
  fetchMock
    .mockResolvedValueOnce(reply({ banned: false }))
    .mockResolvedValueOnce(reply({}));
  render(<AppealPage />);
  expect(
    await screen.findByRole("heading", { name: "Not Banned" }),
  ).toBeVisible();
  await act(() => jest.advanceTimersByTimeAsync(90000));
  expect(sessionStorage.getItem("kc_token")).toBe(access);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test("avoids overlapping ban checks when the token refreshes during a slow request", async () => {
  jest.useFakeTimers();
  sessionStorage.setItem("kc_token", token(Date.now() / 1000 + 75));
  sessionStorage.setItem("kc_refresh_token", "refresh");
  let completeBanCheck: (value: ReturnType<typeof reply>) => void = () => {};
  const pendingBanCheck = new Promise<ReturnType<typeof reply>>((resolve) => {
    completeBanCheck = resolve;
  });
  fetchMock.mockImplementation(async (url: string) => {
    if (url === "/api/v2/users/banned") return pendingBanCheck;
    if (url === "/api/v2/keycloak/refresh")
      return reply({ access_token: validToken() });
    return reply({});
  });
  render(<AppealPage />);
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  await act(() => jest.advanceTimersByTimeAsync(30000));
  expect(
    fetchMock.mock.calls.filter(([url]) => url === "/api/v2/users/banned"),
  ).toHaveLength(1);
  await act(async () => {
    completeBanCheck(reply({ banned: false }));
  });
  expect(
    await screen.findByRole("heading", { name: "Not Banned" }),
  ).toBeVisible();
});
const token = (exp: number) =>
  `header.${btoa(JSON.stringify({ exp }))}.signature`;
const validToken = () => token(Date.now() / 1000 + 3600);
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86400000).toISOString();
const reply = (body: object, ok = true) => ({ ok, json: async () => body });
const appeal = (status: string, age: number) => ({
  id: "appeal-1",
  status,
  created_at: daysAgo(age + 1),
  decided_at: daysAgo(age),
  response_message: "Moderator response",
  reason: "My reason",
  solution: "My solution",
  future: "My plan",
  extra: "Extra context",
});

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  global.fetch = originalFetch;
  sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});

test("exchanges a code when the server supplies only an access token", async () => {
  window.history.replaceState({}, "", "/appeal?code=minimal");
  fetchMock
    .mockResolvedValueOnce(reply({ access_token: validToken() }))
    .mockResolvedValueOnce(reply({ banned: false }))
    .mockResolvedValueOnce(reply({ id: "history" }));
  render(<AppealPage />);
  expect(
    await screen.findByRole("heading", { name: "Appeal History" }),
  ).toBeVisible();
  expect(screen.getByText("Unknown")).toBeVisible();
  expect(sessionStorage.getItem("kc_refresh_token")).toBeNull();
  expect(sessionStorage.getItem("kc_id_token")).toBeNull();
});

test("keeps a denied appeal locked when no decision timestamp is available", async () => {
  sessionStorage.setItem("kc_token", validToken());
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(
      reply({ id: "denied", status: "DENIED", created_at: daysAgo(1) }),
    );
  render(<AppealPage />);
  expect(
    await screen.findByRole("heading", { name: "Your Appeal Status" }),
  ).toBeVisible();
  expect(screen.queryByRole("button", { name: "Submit Appeal" })).toBeNull();
});

test("shares a background token refresh with an appeal submission", async () => {
  jest.useFakeTimers();
  sessionStorage.setItem("kc_token", token(Date.now() / 1000 + 75));
  sessionStorage.setItem("kc_refresh_token", "refresh");
  let completeRefresh: (value: ReturnType<typeof reply>) => void = () => {};
  const pendingRefresh = new Promise<ReturnType<typeof reply>>((resolve) => {
    completeRefresh = resolve;
  });
  fetchMock.mockImplementation(async (url: string) => {
    if (url === "/api/v2/keycloak/refresh") return pendingRefresh;
    if (url === "/api/v2/users/banned") return reply({ banned: true });
    if (url === "/api/v2/appeals/create")
      return reply({ message: "Submission success" });
    return reply({});
  });
  render(<AppealPage />);
  const submit = await screen.findByRole("button", { name: "Submit Appeal" });
  for (const label of [
    /why you were banned/i,
    /make amends/i,
    /avoid repeating/i,
  ]) {
    fireEvent.change(screen.getByRole("textbox", { name: label }), {
      target: { value: "Answer" },
    });
  }
  await act(() => jest.advanceTimersByTimeAsync(30000));
  fireEvent.click(submit);
  expect(
    fetchMock.mock.calls.filter(([url]) => url === "/api/v2/keycloak/refresh"),
  ).toHaveLength(1);
  await act(async () => {
    completeRefresh(reply({ access_token: validToken() }));
  });
  expect(await screen.findByText("Submission success")).toBeVisible();
  expect(
    fetchMock.mock.calls.filter(([url]) => url === "/api/v2/appeals/create"),
  ).toHaveLength(1);
  expect(
    fetchMock.mock.calls.filter(([url]) => url === "/api/v2/keycloak/refresh"),
  ).toHaveLength(1);
});

test("handles credentials removed between initialization and the ban check", async () => {
  const getItem = Storage.prototype.getItem;
  let tokenReads = 0;
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(function (
    this: Storage,
    key: string,
  ) {
    if (key === "kc_token") {
      tokenReads += 1;
      return tokenReads === 1 ? validToken() : null;
    }
    return getItem.call(this, key);
  });
  render(<AppealPage />);
  await waitFor(() => expect(tokenReads).toBeGreaterThan(1));
  expect(fetchMock).not.toHaveBeenCalled();
});

test.each(["missing token", "network error"])(
  "returns to login when the code exchange fails with %s",
  async (failure) => {
    window.history.replaceState({}, "", "/appeal?code=invalid");
    if (failure === "network error")
      fetchMock.mockRejectedValueOnce(new Error("Offline"));
    else fetchMock.mockResolvedValueOnce(reply({}, false));
    render(<AppealPage />);
    expect(
      await screen.findByRole("link", { name: "Login with Discord" }),
    ).toBeVisible();
    expect(sessionStorage.getItem("kc_token")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  },
);

test("refreshes the session in the background, then returns to login if refresh fails", async () => {
  jest.useFakeTimers();
  const access = token(Date.now() / 1000 + 75);
  const refreshed = token(Date.now() / 1000 + 100);
  sessionStorage.setItem("kc_token", access);
  sessionStorage.setItem("kc_refresh_token", "refresh");
  fetchMock
    .mockResolvedValueOnce(reply({ banned: false }))
    .mockResolvedValueOnce(reply({}, false))
    .mockResolvedValueOnce(reply({ access_token: refreshed }))
    .mockResolvedValueOnce(reply({ banned: false }))
    .mockResolvedValueOnce(reply({}, false))
    .mockResolvedValueOnce(reply({}, false));
  render(<AppealPage />);
  expect(
    await screen.findByRole("heading", { name: "Not Banned" }),
  ).toBeVisible();
  await act(() => jest.advanceTimersByTimeAsync(30000));
  expect(sessionStorage.getItem("kc_token")).toBe(refreshed);
  expect(fetchMock).toHaveBeenNthCalledWith(
    4,
    "/api/v2/users/banned",
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: `Bearer ${refreshed}`,
      }),
    }),
  );
  await act(() => jest.advanceTimersByTimeAsync(30000));
  expect(
    screen.getByRole("link", { name: "Login with Discord" }),
  ).toBeVisible();
  expect(sessionStorage.getItem("kc_refresh_token")).toBeNull();
});

test.each(["HTTP error", "network error"])(
  "reports a reminder %s",
  async (failure) => {
    sessionStorage.setItem("kc_token", validToken());
    fetchMock
      .mockResolvedValueOnce(reply({ banned: true }))
      .mockResolvedValueOnce(reply(appeal("RECEIVED", 4)));
    if (failure === "HTTP error")
      fetchMock.mockResolvedValueOnce(
        reply({ error: "Reminder unavailable" }, false),
      );
    else fetchMock.mockRejectedValueOnce(new Error("Offline"));
    render(<AppealPage />);
    const remind = await screen.findByRole("button", { name: "Send Reminder" });
    fireEvent.click(remind);
    expect(
      await screen.findByText(/reminder unavailable|failed to send reminder/i),
    ).toBeVisible();
    expect(remind).toBeEnabled();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  },
);

test("offers Discord login to a visitor without credentials", async () => {
  render(<AppealPage />);
  expect(
    await screen.findByRole("link", { name: "Login with Discord" }),
  ).toHaveAttribute("href", "https://auth.example.test/login");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("exchanges an authorization code and uses the resulting session", async () => {
  window.history.replaceState({}, "", "/appeal?code=example");
  const access = validToken();
  fetchMock
    .mockResolvedValueOnce(
      reply({ access_token: access, refresh_token: "refresh", id_token: "id" }),
    )
    .mockResolvedValueOnce(reply({ banned: false }))
    .mockResolvedValueOnce(reply({}, false));
  render(<AppealPage />);
  expect(
    await screen.findByRole("heading", { name: "Not Banned" }),
  ).toBeVisible();
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    "/api/v2/keycloak/token",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ code: "example" }),
    }),
  );
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    "/api/v2/users/banned",
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: `Bearer ${access}` }),
    }),
  );
  expect(sessionStorage.getItem("kc_refresh_token")).toBe("refresh");
  expect(sessionStorage.getItem("kc_id_token")).toBe("id");
  expect(window.location.search).toBe("");
});

test("refreshes an expired token before requesting ban status", async () => {
  sessionStorage.setItem("kc_token", token(0));
  sessionStorage.setItem("kc_refresh_token", "old-refresh");
  const access = validToken();
  fetchMock
    .mockResolvedValueOnce(
      reply({
        access_token: access,
        refresh_token: "new-refresh",
        id_token: "new-id",
      }),
    )
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply({}));
  render(<AppealPage />);
  expect(
    await screen.findByRole("heading", { name: "Submit Ban Appeal" }),
  ).toBeVisible();
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    "/api/v2/keycloak/refresh",
    expect.objectContaining({
      body: JSON.stringify({ refresh_token: "old-refresh" }),
    }),
  );
  expect(sessionStorage.getItem("kc_token")).toBe(access);
  expect(sessionStorage.getItem("kc_refresh_token")).toBe("new-refresh");
});

test.each([
  ["malformed", false],
  [token(0), false],
  [token(0), true],
])(
  "returns to login when the stored session is unusable (%#)",
  async (stored, refresh) => {
    sessionStorage.setItem("kc_token", stored);
    if (refresh) sessionStorage.setItem("kc_refresh_token", "expired-refresh");
    fetchMock.mockResolvedValue(reply({}, false));
    render(<AppealPage />);
    expect(
      await screen.findByRole("link", { name: "Login with Discord" }),
    ).toBeVisible();
    expect(sessionStorage.getItem("kc_token")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(refresh ? 1 : 0);
  },
);

test.each([
  [true, "ACCEPTED", 1, "Submit Ban Appeal"],
  [true, "DENIED", 1, "Your Appeal Status"],
  [true, "DENIED", 100, "Submit New Ban Appeal"],
  [false, "ACCEPTED", 1, "Appeal History"],
  [false, "DENIED", 1, "Appeal History"],
  [false, "RECEIVED", 1, "Appeal History"],
])(
  "renders the appropriate view for ban=%s, status=%s, age=%s",
  async (banned, status, age, heading) => {
    sessionStorage.setItem("kc_token", validToken());
    fetchMock
      .mockResolvedValueOnce(reply({ banned }))
      .mockResolvedValueOnce(reply(appeal(status, age)));
    render(<AppealPage />);
    expect(await screen.findByRole("heading", { name: heading })).toBeVisible();
    if (!banned) {
      expect(
        screen.getByText(
          /appeal accepted!|appeal was denied|appeal still pending/i,
        ),
      ).toBeVisible();
    }
  },
);

test("sends a reminder for an older pending appeal and reloads its status", async () => {
  sessionStorage.setItem("kc_token", validToken());
  const pending = appeal("RECEIVED", 4);
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply(pending))
    .mockResolvedValueOnce(reply({ message: "Reminder sent" }))
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply({ ...pending, reminded_at: daysAgo(0) }));
  render(<AppealPage />);
  fireEvent.click(await screen.findByRole("button", { name: "Send Reminder" }));
  expect(await screen.findByText(/last reminder:/i)).toBeVisible();
  expect(fetchMock).toHaveBeenNthCalledWith(
    3,
    "/api/v2/appeals/remind",
    expect.objectContaining({ method: "POST" }),
  );
});

test("shows a submission error and allows retrying", async () => {
  sessionStorage.setItem("kc_token", validToken());
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply({}, false))
    .mockResolvedValueOnce(
      reply({ error: "User not found in database" }, false),
    );
  render(<AppealPage />);
  const submit = await screen.findByRole("button", { name: "Submit Appeal" });
  const data = {
    reason: "Reason",
    solution: "Solution",
    future: "Plan",
    extra: "",
  };
  fireEvent.change(
    screen.getByRole("textbox", { name: /why you were banned/i }),
    { target: { value: data.reason } },
  );
  fireEvent.change(screen.getByRole("textbox", { name: /make amends/i }), {
    target: { value: data.solution },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /avoid repeating/i }), {
    target: { value: data.future },
  });
  fireEvent.click(submit);
  expect(
    await screen.findByText(/your account could not be found/i),
  ).toBeVisible();
  expect(fetchMock).toHaveBeenNthCalledWith(
    3,
    "/api/v2/appeals/create",
    expect.objectContaining({ method: "POST", body: JSON.stringify(data) }),
  );
  await waitFor(() => expect(submit).toBeEnabled());
});

test("disables reminders for a newly submitted appeal", async () => {
  sessionStorage.setItem("kc_token", validToken());
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(
      reply({ ...appeal("RECEIVED", 0), created_at: daysAgo(0) }),
    );
  render(<AppealPage />);
  expect(
    await screen.findByRole("button", { name: "Come back in 48 hours" }),
  ).toBeDisabled();
  expect(screen.getByText(/you can send a reminder 48 hours/i)).toBeVisible();
});

test("submits an appeal and refreshes its status", async () => {
  jest.useFakeTimers();
  sessionStorage.setItem("kc_token", validToken());
  fetchMock
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply({}, false))
    .mockResolvedValueOnce(reply({}))
    .mockResolvedValueOnce(reply({ banned: true }))
    .mockResolvedValueOnce(reply(appeal("RECEIVED", 0)));
  render(<AppealPage />);
  const submit = await screen.findByRole("button", { name: "Submit Appeal" });
  fireEvent.change(
    screen.getByRole("textbox", { name: /why you were banned/i }),
    { target: { value: "Reason" } },
  );
  fireEvent.change(screen.getByRole("textbox", { name: /make amends/i }), {
    target: { value: "Solution" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /avoid repeating/i }), {
    target: { value: "Plan" },
  });
  fireEvent.click(submit);
  expect(await screen.findByText("Under Review")).toBeVisible();
  expect(screen.getByText("Your appeal has been submitted.")).toBeVisible();
  expect(fetchMock).toHaveBeenCalledTimes(5);
  await act(() => jest.advanceTimersByTimeAsync(3000));
  expect(screen.queryByText("Your appeal has been submitted.")).toBeNull();
  expect(screen.getByText("Under Review")).toBeVisible();
});

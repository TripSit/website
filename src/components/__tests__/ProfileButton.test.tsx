import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProfileButton from "../ProfileButton";

jest.mock("@/utils/keycloak", () => ({
  getLoginUrl: () => "#login",
  // Records the ID token that was still stored when the logout URL was built.
  getPostLogoutUrl: () =>
    `#logout-hint-${sessionStorage.getItem("kc_id_token") ?? "missing"}`,
}));

const originalFetch = global.fetch;
const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
  global.fetch = originalFetch;
  sessionStorage.clear();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

test("starts login when a guest clicks the profile button", () => {
  render(<ProfileButton />);
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(window.location.hash).toBe("#login");
});

test("falls back to the guest avatar when credentials disappear before the avatar fetch", () => {
  const originalGetItem = Storage.prototype.getItem;
  let tokenReads = 0;
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(function (
    this: Storage,
    key: string,
  ) {
    if (key === "kc_token") {
      tokenReads += 1;
      return tokenReads === 1 ? "temporary-token" : null;
    }
    return originalGetItem.call(this, key);
  });
  render(<ProfileButton />);
  expect(
    screen.getByRole("button", { name: "Account menu" }).style.backgroundImage,
  ).toContain("/assets/img/guest.png");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("closes the menu on a second click and clears session tokens on logout", async () => {
  sessionStorage.setItem("kc_token", "token");
  sessionStorage.setItem("kc_refresh_token", "refresh");
  sessionStorage.setItem("kc_id_token", "id");
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ avatarUrl: "/avatar.png" }),
  });
  render(<ProfileButton />);
  const account = screen.getByRole("button", { name: "Account menu" });
  await waitFor(() =>
    expect(account.style.backgroundImage).toContain("/avatar.png"),
  );
  fireEvent.click(account);
  fireEvent.mouseDown(account);
  expect(screen.getByRole("button", { name: "Logout" })).toBeVisible();
  fireEvent.click(account);
  expect(screen.queryByRole("button", { name: "Logout" })).toBeNull();
  fireEvent.click(account);
  fireEvent.click(screen.getByRole("button", { name: "Logout" }));
  expect(sessionStorage).toHaveLength(0);
  expect(screen.getByRole("button", { name: "Login" })).toBeVisible();
  // The logout URL was built before the ID token was cleared.
  expect(window.location.hash).toBe("#logout-hint-id");
});

test("ignores a token in localStorage, which logout doesn't clear", () => {
  localStorage.setItem("kc_token", "stale-token");
  render(<ProfileButton />);
  expect(screen.getByRole("button", { name: "Login" })).toBeVisible();
  expect(fetchMock).not.toHaveBeenCalled();
});

test("reacts to session changes and dismisses the account menu outside", async () => {
  const consoleError = jest.spyOn(console, "error");
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ avatarUrl: "/avatar.png" }),
  });
  render(<ProfileButton />);
  expect(screen.getByRole("button", { name: "Login" })).toBeVisible();
  expect(fetchMock).not.toHaveBeenCalled();

  sessionStorage.setItem("kc_token", "session-token");
  fireEvent(window, new Event("tokensUpdated"));
  const account = screen.getByRole("button", { name: "Account menu" });
  await waitFor(() =>
    expect(account.style.backgroundImage).toContain("/avatar.png"),
  );
  expect(fetchMock).toHaveBeenCalledWith("/api/v2/users/avatar", {
    headers: {
      Authorization: "Bearer session-token",
      "Content-Type": "application/json",
    },
  });

  fireEvent.click(account);
  expect(screen.getByRole("button", { name: "Logout" })).toBeVisible();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole("button", { name: "Logout" })).toBeNull();

  sessionStorage.clear();
  fireEvent.focus(window);
  const login = screen.getByRole("button", { name: "Login" });
  expect(login).toBeVisible();
  expect(login.style.backgroundImage).toBe("");
  expect(login.style.backgroundColor).toBe("var(--color-surface)");
  expect(consoleError).not.toHaveBeenCalled();
});

test.each(["HTTP error", "network error"])(
  "uses the guest avatar after an avatar %s",
  async (error) => {
    if (error === "HTTP error") fetchMock.mockResolvedValue({ ok: false });
    else fetchMock.mockRejectedValue(new Error("Offline"));
    sessionStorage.setItem("kc_token", "stored-token");
    render(<ProfileButton />);
    const account = screen.getByRole("button", { name: "Account menu" });
    await waitFor(() =>
      expect(account.style.backgroundImage).toContain("/assets/img/guest.png"),
    );
  },
);

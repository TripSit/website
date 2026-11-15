import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProfileButton from "../ProfileButton";

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
    localStorage.setItem("kc_token", "stored-token");
    render(<ProfileButton />);
    const account = screen.getByRole("button", { name: "Account menu" });
    await waitFor(() =>
      expect(account.style.backgroundImage).toContain("/assets/img/guest.png"),
    );
  },
);

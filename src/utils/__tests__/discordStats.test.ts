import axios from "axios";
import { getDiscordStats } from "../discordStats";

jest.mock("axios", () => ({ __esModule: true, default: { get: jest.fn() } }));

const mockedGet = axios.get as jest.Mock;

describe("getDiscordStats", () => {
  beforeEach(() => mockedGet.mockReset());

  it("returns only the member and presence counts", async () => {
    mockedGet.mockResolvedValue({
      data: {
        id: "179641883222474752",
        name: "TripSit",
        roles: [{ id: "1", name: "Moderator", permissions: "8" }],
        emojis: [],
        approximate_member_count: 1234,
        approximate_presence_count: 56,
      },
    });

    await expect(getDiscordStats("token")).resolves.toEqual({
      memberCount: 1234,
      presenceCount: 56,
    });
    expect(mockedGet).toHaveBeenCalledWith(
      expect.stringContaining("with_counts=true"),
      expect.objectContaining({ headers: { Authorization: "Bot token" } }),
    );
  });

  it("skips the request when no token is configured", async () => {
    await expect(getDiscordStats("")).resolves.toBeNull();
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("returns null when Discord fails", async () => {
    mockedGet.mockRejectedValue(new Error("timeout"));

    await expect(getDiscordStats("token")).resolves.toBeNull();
  });
});

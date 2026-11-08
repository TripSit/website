import axios from "axios";
import { getDiscordStats } from "../discordStats";

jest.mock("axios", () => ({ __esModule: true, default: { get: jest.fn() } }));

const mockedGet = axios.get as jest.Mock;

describe("getDiscordStats", () => {
  const originalGuildId = process.env.DISCORD_GUILD_ID;

  beforeEach(() => {
    mockedGet.mockReset();
    delete process.env.DISCORD_GUILD_ID;
  });

  afterAll(() => {
    if (originalGuildId === undefined) delete process.env.DISCORD_GUILD_ID;
    else process.env.DISCORD_GUILD_ID = originalGuildId;
  });

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

  it("asks for the production server when DISCORD_GUILD_ID is unset", async () => {
    mockedGet.mockResolvedValue({ data: {} });

    await getDiscordStats("token");
    expect(mockedGet).toHaveBeenCalledWith(
      "https://discord.com/api/v10/guilds/179641883222474752?with_counts=true",
      expect.anything(),
    );
  });

  it("asks for the server in DISCORD_GUILD_ID when set", async () => {
    process.env.DISCORD_GUILD_ID = "123456789012345678";
    mockedGet.mockResolvedValue({ data: {} });

    await getDiscordStats("token");
    expect(mockedGet).toHaveBeenCalledWith(
      "https://discord.com/api/v10/guilds/123456789012345678?with_counts=true",
      expect.anything(),
    );
  });

  it("falls back to the production server when DISCORD_GUILD_ID is empty", async () => {
    process.env.DISCORD_GUILD_ID = "";
    mockedGet.mockResolvedValue({ data: {} });

    await getDiscordStats("token");
    expect(mockedGet).toHaveBeenCalledWith(
      expect.stringContaining("/guilds/179641883222474752?"),
      expect.anything(),
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

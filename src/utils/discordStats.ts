import axios from "axios";
import type { APIGuild } from "discord-api-types/v10";

const GUILD_ID = "179641883222474752";
const GUILD_URL = `https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`;

export type DiscordStats = {
  memberCount: number;
  presenceCount: number;
};

// Returns only the two counts. Page props are embedded in the HTML, so the full guild
// object (roles, permissions, emojis, channel IDs) must never be passed through.
export async function getDiscordStats(
  token: string | undefined = process.env.DISCORD_CLIENT_TOKEN,
): Promise<DiscordStats | null> {
  if (!token) return null;
  try {
    const { data } = await axios.get<APIGuild>(GUILD_URL, {
      timeout: 3000,
      headers: { Authorization: `Bot ${token}` },
    });
    return {
      memberCount: data.approximate_member_count ?? 0,
      presenceCount: data.approximate_presence_count ?? 0,
    };
  } catch {
    return null;
  }
}

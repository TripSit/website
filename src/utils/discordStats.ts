import axios from "axios";
import type { APIGuild } from "discord-api-types/v10";

// The production TripSit server. Other environments set DISCORD_GUILD_ID to a server their
// own bot belongs to: Discord answers 404 "Unknown Guild" for a server the bot isn't in.
const DEFAULT_GUILD_ID = "179641883222474752";

export type DiscordStats = {
  memberCount: number;
  presenceCount: number;
};

// Returns only the two counts. Page props are embedded in the HTML, so the full guild
// object (roles, permissions, emojis, channel IDs) must never be passed through.
export async function getDiscordStats(
  token: string | undefined = process.env.DISCORD_CLIENT_TOKEN,
  guildId: string = process.env.DISCORD_GUILD_ID || DEFAULT_GUILD_ID,
): Promise<DiscordStats | null> {
  if (!token) return null;
  try {
    const { data } = await axios.get<APIGuild>(
      `https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}?with_counts=true`,
      {
        timeout: 3000,
        headers: { Authorization: `Bot ${token}` },
      },
    );
    return {
      memberCount: data.approximate_member_count ?? 0,
      presenceCount: data.approximate_presence_count ?? 0,
    };
  } catch {
    return null;
  }
}

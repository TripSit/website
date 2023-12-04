import axios from "axios";
import { useState, useEffect } from "react";
import Counter from "./Counter";

function DiscordMembers() {
  const [discordmembers, setDiscordmembers] = useState(null);

  const baseUrl = "https://discord.com/api/v10";
  const guildId = "179641883222474752";

  const url = `${baseUrl}/guilds/${guildId}?with_counts=true`;

  useEffect(() => {
    async function fetchMetrics() {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
        },
      });
      // console.log("Discord metrics:", response.data);
      setDiscordmembers(response.data.approximate_member_count);
    }

    fetchMetrics();
  }, [url]);

  if (!discordmembers) return <div>0</div>;

  return (
    <Counter
      data={{
        startNum: 0,
        endNum: discordmembers,
        duration: 4,
        delay: 1,
      }}
    />
  );
}

export default DiscordMembers;

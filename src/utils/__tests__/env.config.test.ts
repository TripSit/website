test.each([
  ["production", "production"],
  ["test", "development"],
] as const)(
  "exports the configured environment for NODE_ENV=%s",
  (nodeEnv, expected) => {
    const previousEnv = global.env;
    jest.replaceProperty(process, "env", {
      ...process.env,
      NODE_ENV: nodeEnv,
      DISCORD_GUILD_ID: "test-guild",
    });
    try {
      jest.isolateModules(() => {
        const { env } =
          jest.requireActual<typeof import("../env.config")>("../env.config");
        expect(env.NODE_ENV).toBe(expected);
        expect(env.DISCORD_GUILD_ID).toBe("test-guild");
        expect(global.env).toBe(env);
      });
    } finally {
      global.env = previousEnv;
      jest.restoreAllMocks();
    }
  },
);

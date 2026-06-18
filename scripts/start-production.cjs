const { spawnSync } = require("node:child_process");
const { PRODUCTION_PORT } = require("../server.config.cjs");

const port = String(PRODUCTION_PORT);

const result = spawnSync("npx", ["next", "start", "-p", port], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: port,
  },
});

process.exit(result.status ?? 1);

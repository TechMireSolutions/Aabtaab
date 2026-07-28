/**
 * PM2 runtime entry for aabtaab-next.
 * Binds Next.js to PRODUCTION_PORT (3000) on 127.0.0.1 behind Apache.
 */
const { spawn } = require("node:child_process");
const path = require("node:path");
const { PRODUCTION_PORT } = require("../server.config.cjs");

const root = path.join(__dirname, "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const port = String(process.env.PORT || PRODUCTION_PORT);
const hostname = process.env.HOSTNAME || "127.0.0.1";

const child = spawn(
  process.execPath,
  [nextBin, "start", "--port", port, "--hostname", hostname],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: port,
      HOSTNAME: hostname,
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

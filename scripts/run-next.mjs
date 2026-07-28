#!/usr/bin/env node
/**
 * Thin Next.js launcher that always binds to an explicit port (default 3000).
 * Usage: node scripts/run-next.mjs <dev|start|build> [--port 3000] [...next args]
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PRODUCTION_PORT } = require("../server.config.cjs");
const nextBin = require.resolve("next/dist/bin/next");

const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.error("Usage: node scripts/run-next.mjs <dev|start|build> [--port N] ...");
  process.exit(1);
}

/** Drop bare numeric leftovers (e.g. PM2 stale args → `start --port 3000 3000`). */
function sanitizeArgs(args) {
  const out = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const prev = out[out.length - 1];
    const prevIsPortFlag = prev === "-p" || prev === "--port";
    if (/^\d+$/.test(arg) && !prevIsPortFlag) {
      continue;
    }
    out.push(arg);
  }
  return out;
}

const cleaned = sanitizeArgs(argv);

const hasPortFlag = cleaned.some((arg, i) => {
  if (arg === "-p" || arg === "--port") return true;
  if (arg.startsWith("--port=")) return true;
  if (arg.startsWith("-p=") || /^-p\d+$/.test(arg)) return true;
  return arg === "-p" && cleaned[i + 1] != null;
});

const command = cleaned[0];
const rest = cleaned.slice(1);
const port = String(process.env.PORT || PRODUCTION_PORT);

const nextArgs =
  !hasPortFlag && (command === "dev" || command === "start")
    ? [command, "--port", port, ...rest]
    : cleaned;

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: process.env.PORT || port,
    HOSTNAME: process.env.HOSTNAME || "127.0.0.1",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

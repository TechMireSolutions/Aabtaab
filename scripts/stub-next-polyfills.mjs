#!/usr/bin/env node
/**
 * Ensures the empty Next.js polyfill stub exists after install.
 * Keeps modern-browser builds free of unused legacy polyfill weight.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const stubPath = path.join(root, "lib", "empty-polyfill.js");

const contents = `/**
 * Stub for Next.js polyfill-module on modern browsers (Chrome 111+, Safari 16.4+).
 * @see https://nextjs.org/docs/architecture/supported-browsers
 */
`;

fs.mkdirSync(path.dirname(stubPath), { recursive: true });
if (!fs.existsSync(stubPath) || fs.readFileSync(stubPath, "utf8").trim() === "") {
  fs.writeFileSync(stubPath, contents, "utf8");
}

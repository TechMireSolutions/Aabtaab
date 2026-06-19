#!/usr/bin/env node
/** Generate public/og-default.png — brand fallback for Open Graph */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../public/og-default.png");

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#164e63"/>
      <stop offset="100%" style="stop-color:#0e7490"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="300" font-family="system-ui,sans-serif" font-size="72" font-weight="700"
    fill="#ffffff" text-anchor="middle">Aabtaab</text>
  <text x="600" y="370" font-family="system-ui,sans-serif" font-size="28" font-weight="400"
    fill="#cffafe" text-anchor="middle">Shia Islamic Knowledge &amp; Community</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("Wrote", out);

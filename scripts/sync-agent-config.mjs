#!/usr/bin/env node
/**
 * Mirror .cursor/rules and .cursor/skills → Antigravity (.agents/) and Claude (.claude/).
 * Source of truth: .cursor/
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CURSOR_RULES = path.join(ROOT, ".cursor/rules");
const CURSOR_SKILLS = path.join(ROOT, ".cursor/skills");

const TARGETS = [
  {
    rules: path.join(ROOT, ".agents/rules"),
    skills: path.join(ROOT, ".agents/skills"),
    label: "Antigravity",
    format: "antigravity",
  },
  {
    rules: path.join(ROOT, ".claude/rules"),
    skills: path.join(ROOT, ".claude/skills"),
    label: "Claude Code",
    format: "claude",
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseMdc(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: "", body: content };
  return { frontmatter: match[1], body: match[2] };
}

function readMdcField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`${field}:\\s*(.+)`));
  return match?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
}

function toAntigravityRule(frontmatter, body) {
  const description = readMdcField(frontmatter, "description") || "Project rule";
  const globs = readMdcField(frontmatter, "globs");
  const alwaysApply = /alwaysApply:\s*true/.test(frontmatter);
  const trigger = alwaysApply ? "always_on" : globs ? "glob" : "model_decision";

  return [
    "---",
    `trigger: ${trigger}`,
    globs ? `glob: ${globs}` : "glob:",
    `description: ${description}`,
    "---",
    "",
    body.trimStart(),
  ].join("\n");
}

function toClaudeRule(frontmatter, body, basename) {
  const description = readMdcField(frontmatter, "description") || basename;
  const globs = readMdcField(frontmatter, "globs");
  const alwaysApply = /alwaysApply:\s*true/.test(frontmatter);

  let header = `# ${basename.replace(/^\d+-/, "").replace(/-/g, " ")}\n\n`;
  if (description) header += `> ${description}\n\n`;
  if (globs) header += `**Scope:** \`${globs}\`\n\n`;
  if (alwaysApply) header += `**Always apply:** yes\n\n`;

  return header + body.trimStart();
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else if (entry.isFile()) fs.copyFileSync(srcPath, destPath);
  }
}

function listMdcFiles() {
  if (!fs.existsSync(CURSOR_RULES)) return [];
  return fs
    .readdirSync(CURSOR_RULES)
    .filter((f) => f.endsWith(".mdc"))
    .sort();
}

function syncRules() {
  const mdcFiles = listMdcFiles();
  const expectedMd = new Set(mdcFiles.map((f) => f.replace(/\.mdc$/, ".md")));

  for (const { rules, format } of TARGETS) {
    ensureDir(rules);

    // Remove stale mirrored rules (not from current .mdc set)
    for (const file of fs.readdirSync(rules)) {
      if (file.endsWith(".md") && !expectedMd.has(file)) {
        fs.unlinkSync(path.join(rules, file));
      }
    }

    for (const file of mdcFiles) {
      const content = fs.readFileSync(path.join(CURSOR_RULES, file), "utf8");
      const { frontmatter, body } = parseMdc(content);
      const basename = file.replace(/\.mdc$/, "");
      const output =
        format === "antigravity"
          ? toAntigravityRule(frontmatter, body)
          : toClaudeRule(frontmatter, body, basename);
      fs.writeFileSync(path.join(rules, `${basename}.md`), output);
    }
  }
}

function syncSkills() {
  if (!fs.existsSync(CURSOR_SKILLS)) return;
  for (const { skills } of TARGETS) {
    fs.rmSync(skills, { recursive: true, force: true });
    copyDir(CURSOR_SKILLS, skills);
  }
}

function buildLegacyAntigravityIndex(mdcFiles) {
  const lines = [
    "# Aabtaab Agent Rules (generated)",
    "",
    "> **Do not edit.** Source: `.cursor/rules/` — run `npm run sync:agents`.",
    "",
    "Active rule files in this folder:",
    "",
  ];

  for (const file of mdcFiles) {
    const name = file.replace(/\.mdc$/, ".md");
    lines.push(`- \`${name}\``);
  }

  lines.push(
    "",
    `Skills: \`.agents/skills/\` (${fs.existsSync(CURSOR_SKILLS) ? fs.readdirSync(CURSOR_SKILLS).sort().join(", ") : "none"})`,
    "",
    "**Canonical docs:** `techstack.md` (stack) → `.cursor/rules/` (standards) → `.cursor/skills/` (workflows).",
    "",
    "**Caching policy:** use `sanityFetch` + `lib/cms/queries.ts`; `unstable_cache` lives only in `sanity/lib/fetch.ts`.",
    "**Styling:** `02-tailwind-design-system` — `brand-*` tokens, `@utility` in `globals.css`.",
  );

  return lines.join("\n");
}

function syncAntigravityLegacyFiles(mdcFiles) {
  const agentsRules = path.join(ROOT, ".agents/rules");
  const index = buildLegacyAntigravityIndex(mdcFiles);
  fs.writeFileSync(path.join(agentsRules, ".cursorrules"), index);
  fs.writeFileSync(path.join(agentsRules, ".geminirules"), index);
}

function main() {
  const mdcFiles = listMdcFiles();
  syncRules();
  syncSkills();
  syncAntigravityLegacyFiles(mdcFiles);

  console.log("Synced .cursor → .agents + .claude");
  for (const { label, rules, skills } of TARGETS) {
    const ruleCount = fs.existsSync(rules)
      ? fs.readdirSync(rules).filter((f) => f.endsWith(".md")).length
      : 0;
    const skillCount = fs.existsSync(skills)
      ? fs.readdirSync(skills).length
      : 0;
    console.log(`  ${label}: ${ruleCount} rules, ${skillCount} skills`);
  }
  console.log("  Antigravity legacy: .cursorrules + .geminirules regenerated");
}

main();

/**
 * Defensive fixes for known CMS typos until Studio content is corrected.
 * Prefer editing Sanity; these only patch common published mistakes.
 */

const TEXT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bavaiable\b/gi, "available"],
  [/everyone no matter/gi, "everyone, no matter"],
  [/\bNejul Balagha\b/g, "Nahjul Balagha"],
  [/\bNehjul Balagha\b/g, "Nahjul Balagha"],
];

export function sanitizePublicCopy(
  text: string | null | undefined,
): string | undefined {
  if (text == null) return undefined;
  if (text === "") return "";
  return TEXT_REPLACEMENTS.reduce(
    (out, [pattern, replacement]) => out.replace(pattern, replacement),
    text,
  );
}

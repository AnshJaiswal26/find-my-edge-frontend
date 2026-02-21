export function parseDurationByFormat(str, format) {
  if (!str) return null;

  str = str.trim();

  /* ---------- HUMAN FORMATS ---------- */

  if (format === "human" || format === "human-short") {
    const regex = /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/i;
    const match = regex.exec(str);
    if (!match) return null;

    const [, d, h, m, s] = match.map((v) => Number(v || 0));

    return d * 86400 + h * 3600 + m * 60 + s;
  }

  if (format === "human-min") {
    const match = /^(\d+)m$/i.exec(str);
    if (!match) return null;
    return Number(match[1]) * 60;
  }

  /* ---------- CLASSIC FORMATS ---------- */

  let regex = format
    .replace("DD", "(?<DD>\\d{2})")
    .replace("HH", "(?<HH>\\d{2})")
    .replace("hh", "(?<hh>\\d{2})")
    .replace("mm", "(?<mm>\\d{2})")
    .replace("ss", "(?<ss>\\d{2})");

  const match = new RegExp(`^${regex}$`).exec(str);
  if (!match) return null;

  const g = match.groups || {};

  const days = Number(g.DD || 0);
  const hours = Number(g.HH || g.hh || 0);
  const minutes = Number(g.mm || 0);
  const seconds = Number(g.ss || 0);

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

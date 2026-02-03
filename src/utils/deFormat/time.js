export function parseTimeByFormat(str, format) {
  if (!str) return null;

  const regex = format
    .replace("HH", "(?<HH>\\d{2})")
    .replace("hh", "(?<hh>\\d{2})")
    .replace("mm", "(?<mm>\\d{2})")
    .replace("ss", "(?<ss>\\d{2})")
    .replace("A", "(?<A>AM|PM)");

  const match = new RegExp(`^${regex}$`, "i").exec(str.trim());
  if (!match) return null;

  const g = match.groups || {};

  let h = g.HH ? Number(g.HH) : Number(g.hh || 0);
  const m = Number(g.mm || 0);
  const s = Number(g.ss || 0);

  if (g.A) {
    if (g.A.toUpperCase() === "PM" && h < 12) h += 12;
    if (g.A.toUpperCase() === "AM" && h === 12) h = 0;
  }

  return h * 3600 + m * 60 + s;
}

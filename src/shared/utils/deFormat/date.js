const MONTHS_SHORT = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const MONTHS_LONG = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};
export function parseDateByFormat(str, format) {
  if (!str) return null;

  const tokenMap = {
    YYYY: "(?<YYYY>\\d{4})",
    MMMM: "(?<MMMM>[A-Za-z]+)",
    MMM: "(?<MMM>[A-Za-z]{3})",
    MM: "(?<MM>\\d{2})",
    DD: "(?<DD>\\d{2})",
    YY: "(?<YY>\\d{2})",
  };

  const tokens = Object.keys(tokenMap).sort((a, b) => b.length - a.length);

  let i = 0;
  let regex = "";

  while (i < format.length) {
    let matched = false;

    for (const t of tokens) {
      if (format.startsWith(t, i)) {
        regex += tokenMap[t];
        i += t.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Escape literal characters like '-' or '/'
      regex += format[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      i++;
    }
  }

  const match = new RegExp(`^${regex}$`).exec(str.trim());
  if (!match) return null;

  const g = match.groups || {};

  let year =
    g.YYYY ?? (g.YY ? 2000 + Number(g.YY) : new Date().getUTCFullYear());

  let month =
    g.MM != null
      ? Number(g.MM) - 1
      : g.MMM
        ? MONTHS_SHORT[g.MMM]
        : g.MMMM
          ? MONTHS_LONG[g.MMMM]
          : 0;

  let day = g.DD != null ? Number(g.DD) : 1;

  const ms = Date.UTC(year, month, day);
  if (Number.isNaN(ms)) return null;

  return Math.floor(ms / 86400000);
}

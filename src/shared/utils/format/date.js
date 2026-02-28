const DATE_FORMATS = [
  { key: "DD MMM YYYY", label: "15 Apr 2025" },
  { key: "DD/MM/YYYY", label: "15/04/2025" },
  { key: "MM/DD/YYYY", label: "04/15/2025" },
  { key: "YYYY-MM-DD", label: "2025-04-15" },
  { key: "DD-MM-YY", label: "15-04-25" },
  { key: "DD-MM-YYYY", label: "15-04-2025" },
  { key: "MMM DD, YYYY", label: "Apr 15, 2025" },
  { key: "DD MMM", label: "15 Apr" },
  { key: "MMM YYYY", label: "Apr 2025" },
];

const DATE_FORMAT_KEYS = DATE_FORMATS.map(({ key }) => key);

const DATE_FORMAT = {
  DD_MMM_YYYY: "DD MMM YYYY",
  DD_MM_YYYY_SLASH: "DD/MM/YYYY",
  MM_DD_YYYY_SLASH: "MM/DD/YYYY",
  YYYY_MM_DD: "YYYY-MM-DD",
  DD_MM_YY_DASH: "DD-MM-YY",
  DD_MM_YYYY_DASH: "DD-MM-YYYY",
  MMM_DD_YYYY: "MMM DD, YYYY",
  DD_MMM: "DD MMM",
  MMM_YYYY: "MMM YYYY",
};

const formatDate = (value, format, options = {}) => {
  if (typeof value !== "number") return "—";

  // ✅ seconds → ms
  const d = new Date(value * 1000);

  if (Number.isNaN(d.getTime())) return "—";

  // 🔥 IMPORTANT:
  // default = UTC (safe for date-only)
  const useUTC = options.useUTC ?? true;

  const timeZone = useUTC
    ? "UTC"
    : options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // helper to extract parts safely
  const getPart = (type, fallback) => {
    const part = new Intl.DateTimeFormat("en-IN", {
      [type]: fallback,
      timeZone,
    })
      .formatToParts(d)
      .find((p) => p.type === type);

    return part ? part.value : "";
  };

  const map = {
    YYYY: getPart("year", "numeric"),
    YY: getPart("year", "2-digit"),

    MM: getPart("month", "2-digit"),
    DD: getPart("day", "2-digit"),

    MMM: new Intl.DateTimeFormat("en-IN", {
      month: "short",
      timeZone,
    }).format(d),

    MMMM: new Intl.DateTimeFormat("en-IN", {
      month: "long",
      timeZone,
    }).format(d),

    ddd: new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      timeZone,
    }).format(d),

    dddd: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      timeZone,
    }).format(d),
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|DD|dddd|ddd/g, (k) => map[k]);
};

export { DATE_FORMATS, DATE_FORMAT, DATE_FORMAT_KEYS, formatDate };

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

const formatDate = (value, format) => {
  if (typeof value !== "number") return "—";

  // days since epoch → ms
  const d = new Date(value * 86400000);

  if (Number.isNaN(d.getTime())) return "—";

  const map = {
    YYYY: d.getUTCFullYear(),
    YY: String(d.getUTCFullYear()).slice(-2),

    MM: String(d.getUTCMonth() + 1).padStart(2, "0"),
    DD: String(d.getUTCDate()).padStart(2, "0"),

    MMM: d.toLocaleString("en-IN", {
      month: "short",
      timeZone: "UTC",
    }),
    MMMM: d.toLocaleString("en-IN", {
      month: "long",
      timeZone: "UTC",
    }),

    ddd: d.toLocaleString("en-IN", {
      weekday: "short",
      timeZone: "UTC",
    }),
    dddd: d.toLocaleString("en-IN", {
      weekday: "long",
      timeZone: "UTC",
    }),
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|DD|dddd|ddd/g, (k) => map[k]);
};

export { DATE_FORMATS, DATE_FORMAT_KEYS, formatDate };

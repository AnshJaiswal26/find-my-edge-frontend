export const DATE_FORMATS = [
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

export function formatDate(value, format) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  const map = {
    YYYY: d.getFullYear(),
    YY: String(d.getFullYear()).slice(-2),
    MM: String(d.getMonth() + 1).padStart(2, "0"),
    DD: String(d.getDate()).padStart(2, "0"),
    MMM: d.toLocaleString("en-IN", { month: "short" }),
    MMMM: d.toLocaleString("en-IN", { month: "long" }),
    ddd: d.toLocaleString("en-IN", { weekday: "short" }),
    dddd: d.toLocaleString("en-IN", { weekday: "long" }),
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|DD|dddd|ddd/g, (k) => map[k]);
}

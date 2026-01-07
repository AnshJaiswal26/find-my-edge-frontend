export const TIME_FORMATS = [
  { key: "HH:mm", label: "09:30" },
  { key: "HH:mm:ss", label: "09:30:15" },
  { key: "hh:mm A", label: "09:30 AM" },
  { key: "hh:mm:ss A", label: "09:30:15 AM" },
  { key: "mm:ss", label: "05:32" },
];

export function formatTime(value, format) {
  if (typeof value !== "number") return "—";

  // seconds since midnight → h:m:s
  const totalSeconds = Math.max(0, Math.floor(value));

  const h24 = Math.floor(totalSeconds / 3600) % 24;
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const h12 = h24 % 12 || 12;
  const ampm = h24 < 12 ? "AM" : "PM";

  const map = {
    HH: String(h24).padStart(2, "0"),
    hh: String(h12).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    ss: String(s).padStart(2, "0"),
    A: ampm,
  };

  return format.replace(/HH|hh|mm|ss|A/g, (k) => map[k]);
}

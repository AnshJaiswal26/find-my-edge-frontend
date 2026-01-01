export const TIME_FORMATS = [
  { key: "HH:mm", label: "09:30" },
  { key: "HH:mm:ss", label: "09:30:15" },
  { key: "hh:mm A", label: "09:30 AM" },
  { key: "hh:mm:ss A", label: "09:30:15 AM" },
  { key: "mm:ss", label: "05:32" },
];

export function formatTime(value, format) {
  if (!value) return "—";

  const [h, m, s = "00"] = value.split(":");

  const hour = Number(h);
  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";

  const map = {
    HH: h.padStart(2, "0"),
    hh: String(hour12).padStart(2, "0"),
    mm: m.padStart(2, "0"),
    ss: s.padStart(2, "0"),
    A: ampm,
  };

  return format.replace(/HH|hh|mm|ss|A/g, (k) => map[k]);
}

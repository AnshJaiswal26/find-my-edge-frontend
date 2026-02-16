const DURATION_FORMATS = [
  { key: "HH:mm:ss", label: "05:30:15" },
  { key: "mm:ss", label: "30:15" },
  { key: "ss", label: "45" },
  { key: "DD:HH:mm:ss", label: "02:05:30:15" },

  // 🔥 NEW HUMAN FORMATS
  { key: "human", label: "2h 30m 15s" },
  { key: "human-short", label: "2h 30m" },
  { key: "human-min", label: "150m" },
];

const DURATION_FORMAT_KEYS = DURATION_FORMATS.map(({ key }) => key);

function formatDuration(value, format) {
  if (typeof value !== "number") return "—";

  const sign = value < 0 ? "-" : "";
  const totalSeconds = Math.abs(Math.floor(value));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const totalHours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  /* ---------- HUMAN FORMAT 🔥 ---------- */
  if (format === "human") {
    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds || parts.length === 0) parts.push(`${seconds}s`);

    return sign + parts.join(" ");
  }

  if (format === "human-short") {
    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);

    if (parts.length === 0) return sign + `${seconds}s`;

    return sign + parts.join(" ");
  }

  if (format === "human-min") {
    return sign + `${totalMinutes}m`;
  }

  /* ---------- CLASSIC FORMAT ---------- */

  const map = {
    DD: String(days).padStart(2, "0"),
    HH: String(format.includes("DD") ? hours : totalHours).padStart(2, "0"),
    hh: String(hours).padStart(2, "0"),
    mm: String(minutes).padStart(2, "0"),
    ss: String(seconds).padStart(2, "0"),
  };

  return sign + format.replace(/DD|HH|hh|mm|ss/g, (k) => map[k]);
}

export { DURATION_FORMATS, DURATION_FORMAT_KEYS, formatDuration };

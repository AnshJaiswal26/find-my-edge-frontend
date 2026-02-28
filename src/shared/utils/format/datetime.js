const DATETIME_FORMATS = [
  { key: "YYYY-MM-DD HH:mm", label: "2026-02-16 09:30" },
  { key: "YYYY-MM-DD HH:mm:ss", label: "2026-02-16 09:30:15" },

  { key: "YYYY-MM-DD hh:mm A", label: "2026-02-16 09:30 AM" },
  { key: "YYYY-MM-DD hh:mm:ss A", label: "2026-02-16 09:30:15 AM" },

  { key: "DD/MM/YYYY HH:mm", label: "16/02/2026 09:30" },
  { key: "DD/MM/YYYY hh:mm A", label: "16/02/2026 09:30 AM" },
];

const DATETIME_FORMAT_KEYS = DATETIME_FORMATS.map(({ key }) => key);

const DATETIME_FORMAT = {
  YYYY_MM_DD_HH_MM: "YYYY-MM-DD HH:mm",
  YYYY_MM_DD_HH_MM_SS: "YYYY-MM-DD HH:mm:ss",

  YYYY_MM_DD_hh_mm_A: "YYYY-MM-DD hh:mm A",
  YYYY_MM_DD_hh_mm_ss_A: "YYYY-MM-DD hh:mm:ss A",

  DD_MM_YYYY_HH_MM: "DD/MM/YYYY HH:mm",
  DD_MM_YYYY_hh_mm_A: "DD/MM/YYYY hh:mm A",
};

function formatDateTime(value, format, options = {}) {
  if (typeof value !== "number") return "—";

  // ✅ seconds → ms
  const d = new Date(value * 1000);

  if (Number.isNaN(d.getTime())) return "—";

  // 🔥 Always LOCAL by default for datetime
  const timeZone =
    options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // helper to extract parts safely
  const getPart = (type, config) => {
    const part = new Intl.DateTimeFormat("en-IN", {
      ...config,
      timeZone,
    })
      .formatToParts(d)
      .find((p) => p.type === type);

    return part ? part.value : "";
  };

  const YYYY = getPart("year", { year: "numeric" });
  const MM = getPart("month", { month: "2-digit" });
  const DD = getPart("day", { day: "2-digit" });

  const HH = getPart("hour", {
    hour: "2-digit",
    hourCycle: "h23",
  });

  const mm = getPart("minute", { minute: "2-digit" });
  const ss = getPart("second", { second: "2-digit" });

  // derive 12-hour format
  const h24 = Number(HH);
  const h12 = h24 % 12 || 12;
  const hh = String(h12).padStart(2, "0");

  const A = h24 < 12 ? "AM" : "PM";

  const map = {
    YYYY,
    MM,
    DD,
    HH,
    hh,
    mm,
    ss,
    A,
  };

  return format.replace(/YYYY|MM|DD|HH|hh|mm|ss|A/g, (k) => map[k]);
}

export {
  DATETIME_FORMATS,
  DATETIME_FORMAT,
  DATETIME_FORMAT_KEYS,
  formatDateTime,
};

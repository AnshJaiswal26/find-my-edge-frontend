const DATETIME_FORMATS = [
  { key: "YYYY-MM-DD HH:mm", label: "2026-02-16 09:30" },
  { key: "YYYY-MM-DD HH:mm:ss", label: "2026-02-16 09:30:15" },

  { key: "YYYY-MM-DD hh:mm A", label: "2026-02-16 09:30 AM" },
  { key: "YYYY-MM-DD hh:mm:ss A", label: "2026-02-16 09:30:15 AM" },

  { key: "DD/MM/YYYY HH:mm", label: "16/02/2026 09:30" },
  { key: "DD/MM/YYYY hh:mm A", label: "16/02/2026 09:30 AM" },
];

const DATETIME_FORMAT_KEYS = DATETIME_FORMATS.map(({ key }) => key);

function formatDateTime(value, format) {
  if (typeof value !== "number") return "—";

  console.log(value * 1000);
  const d = new Date(value * 1000);

  if (Number.isNaN(d.getTime())) return "—";

  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");

  const h24 = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");

  const h12 = h24 % 12 || 12;
  const hh = String(h12).padStart(2, "0");
  const HH = String(h24).padStart(2, "0");

  const A = h24 < 12 ? "AM" : "PM";

  const map = {
    YYYY: yyyy,
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

export { DATETIME_FORMATS, DATETIME_FORMAT_KEYS, formatDateTime };

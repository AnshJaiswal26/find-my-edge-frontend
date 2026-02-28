const INPUT_TYPES = {
  number: "number",
  date: "date",
  time: "time",
  datetime: "datetime-local",
  duration: "text",
  boolean: "checkbox",
  range: "range",
};

function parseInputValue(raw, semantic) {
  if (typeof raw === "number") return raw;
  if (raw == null || raw === "") return null;

  switch (semantic) {
    /* ---------- NUMBER ---------- */
    case "number": {
      const num = Number(raw);
      return Number.isFinite(num) ? num : null;
    }

    /* ---------- DATE ---------- */
    case "date": {
      // YYYY-MM-DD → epoch seconds (UTC)
      const ms = Date.parse(raw + "T00:00:00Z");
      return Number.isFinite(ms) ? Math.floor(ms / 1000) : null; // seconds
    }

    /* ---------- TIME ---------- */
    case "time": {
      // HH:mm[:ss] → seconds (wrap later in formatter)
      const [h = 0, m = 0, s = 0] = raw.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    }

    /* ---------- DURATION ---------- */
    case "duration": {
      // ALWAYS expect DD:HH:mm:ss
      const [d = 0, h = 0, m = 0, s = 0] = raw.split(":").map(Number);

      return d * 86400 + h * 3600 + m * 60 + s;
    }

    /* ---------- DATETIME ---------- */
    case "datetime": {
      const d = new Date(raw); // local

      if (Number.isNaN(d.getTime())) return null;

      return Math.floor(d.getTime() / 1000);
    }

    default:
      return raw;
  }
}

const pad2 = (n) => String(n).padStart(2, "0");

function formatForInput(value, semantic) {
  if (typeof value === "string") return value;

  if (value == null || value === "" || Number.isNaN(value)) return null;

  switch (semantic) {
    /* ---------- DATE ---------- */
    case "date": {
      const d = new Date(value * 1000); // ✅ seconds → ms

      const yyyy = d.getUTCFullYear();
      const mm = pad2(d.getUTCMonth() + 1);
      const dd = pad2(d.getUTCDate());

      return `${yyyy}-${mm}-${dd}`;
    }

    /* ---------- TIME ---------- */
    case "time": {
      const totalSeconds = Math.floor(value);

      const h = Math.floor(totalSeconds / 3600) % 24;
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    }

    /* ---------- DATETIME 🔥 ---------- */
    case "datetime": {
      const d = new Date(value * 1000);

      if (Number.isNaN(d.getTime())) return "";

      const yyyy = d.getFullYear();
      const mm = pad2(d.getMonth() + 1);
      const dd = pad2(d.getDate());

      const hh = pad2(d.getHours());
      const min = pad2(d.getMinutes());
      const ss = pad2(d.getSeconds());

      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
    }

    /* ---------- DURATION ---------- */
    case "duration": {
      if (value == null) return "00:00:00:00";

      const sign = value < 0 ? "-" : "";
      const totalSeconds = Math.abs(Math.floor(value));

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `${sign}${pad2(days)}:${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    }

    /* ---------- NUMBER ---------- */
    case "number":
      return String(value);

    /* ---------- STRING ---------- */
    case "string":
    case "text":
      return String(value);

    /* ---------- BOOLEAN ---------- */
    case "boolean":
      return value ? "true" : "false";

    default:
      return String(value);
  }
}

export { parseInputValue, pad2, formatForInput, INPUT_TYPES };

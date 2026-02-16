function parseInputValue(raw, semantic) {
  if (raw == null || raw === "") return null;

  switch (semantic) {
    /* ---------- NUMBER ---------- */
    case "number": {
      const num = Number(raw);
      return Number.isFinite(num) ? num : null;
    }

    /* ---------- DATE ---------- */
    case "date": {
      // YYYY-MM-DD → days since epoch
      const ms = Date.parse(raw + "T00:00:00Z");
      return Number.isFinite(ms) ? Math.floor(ms / 86400000) : null;
    }

    /* ---------- TIME ---------- */
    case "time": {
      // HH:mm[:ss] → seconds (wrap later in formatter)
      const [h = 0, m = 0, s = 0] = raw.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    }

    /* ---------- DURATION ---------- */
    case "duration": {
      // supports HH:mm:ss OR DD:HH:mm:ss
      const parts = raw.split(":").map(Number);

      let d = 0,
        h = 0,
        m = 0,
        s = 0;

      if (parts.length === 4) {
        [d, h, m, s] = parts;
      } else if (parts.length === 3) {
        [h, m, s] = parts;
      } else if (parts.length === 2) {
        [m, s] = parts;
      } else {
        s = parts[0];
      }

      return d * 86400 + h * 3600 + m * 60 + s;
    }

    /* ---------- DATETIME ---------- */
    case "datetime": {
      const [datePart, timePart] = raw.split("T");

      if (!datePart || !timePart) return null;

      const [y, m, d] = datePart.split("-").map(Number);
      const [hh = 0, mm = 0, ss = 0] = timePart.split(":").map(Number);

      const dt = new Date(y, m - 1, d, hh, mm, ss);

      return Math.floor(dt.getTime() / 1000); // 🔥 store in seconds
    }

    default:
      return raw;
  }
}

const pad2 = (n) => String(n).padStart(2, "0");

function formatForInput(value, semantic) {
  if (value == null || value === "" || Number.isNaN(value)) return "";

  switch (semantic) {
    /* ---------- DATE ---------- */
    case "date": {
      // value = days since epoch → local date
      const ms = value * 86400000;
      const d = new Date(ms);

      const yyyy = d.getFullYear();
      const mm = pad2(d.getMonth() + 1);
      const dd = pad2(d.getDate());

      return `${yyyy}-${mm}-${dd}`; // ✅ no UTC shift
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
      const sign = value < 0 ? "-" : "";
      const totalSeconds = Math.abs(Math.floor(value));

      const days = Math.floor(totalSeconds / 86400);
      const totalHours = Math.floor(totalSeconds / 3600); // 🔥 important
      const hours = Math.floor((totalSeconds % 86400) / 3600);

      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // if using DD format
      if (days > 0) {
        return `${sign}${pad2(days)}:${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
      }

      // otherwise use TOTAL hours
      return `${sign}${pad2(totalHours)}:${pad2(minutes)}:${pad2(seconds)}`;
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

export { parseInputValue, pad2, formatForInput };

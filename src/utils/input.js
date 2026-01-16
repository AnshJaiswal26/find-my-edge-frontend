export function parseInputValue(raw, valueType) {
  if (raw == null || raw === "") return null;

  switch (valueType) {
    case "number":
      return +raw;

    case "date": {
      // YYYY-MM-DD → days since epoch
      const ms = Date.parse(raw + "T00:00:00Z");
      return Math.floor(ms / 86400000);
    }

    case "time": {
      // HH:mm[:ss] → seconds since midnight
      const [h, m, s = 0] = raw.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    }

    case "datetime": {
      return Date.parse(raw);
    }

    case "duration":
      return +raw; // seconds or minutes (your choice)

    case "boolean":
      return raw === "true" || raw === true;

    default:
      return raw;
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function formatForInput(value, valueType) {
  if (value == null || value === "" || Number.isNaN(value)) return "";

  switch (valueType) {
    case "date": {
      // days → YYYY-MM-DD
      const ms = value * 86400000;
      return new Date(ms).toISOString().slice(0, 10);
    }

    case "time": {
      // seconds → HH:mm:ss
      const h = Math.floor(value / 3600);
      const m = Math.floor((value % 3600) / 60);
      const s = value % 60;
      return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    }

    case "number":
      return String(value);

    default:
      return String(value);
  }
}

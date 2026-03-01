function getDateBucket(value, unit) {
  if (value == null) return null;

  // ✅ value is now epoch seconds
  const d = new Date(value * 1000);

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth(); // 0-based

  switch (unit) {
    case "day": {
      const dayStartSec = Math.floor(
        Date.UTC(year, month, d.getUTCDate()) / 1000,
      );

      return {
        type: "DATE_BUCKET",
        unit,
        key: dayStartSec, // grouping key
        value: dayStartSec, // actual value
      };
    }

    case "month": {
      const monthStartSec = Math.floor(Date.UTC(year, month, 1) / 1000);

      return {
        type: "DATE_BUCKET",
        unit,
        key: year * 12 + month, // same logic
        value: monthStartSec,
        year,
        month,
      };
    }

    case "year": {
      const yearStartSec = Math.floor(Date.UTC(year, 0, 1) / 1000);

      return {
        type: "DATE_BUCKET",
        unit,
        key: year,
        value: yearStartSec,
        year,
      };
    }

    case "week": {
      // ISO-like week (Monday start)

      const day = d.getUTCDay() || 7; // Sunday=0 → 7
      const monday = new Date(d);
      monday.setUTCDate(d.getUTCDate() - day + 1);

      const weekStartSec = Math.floor(
        Date.UTC(
          monday.getUTCFullYear(),
          monday.getUTCMonth(),
          monday.getUTCDate(),
        ) / 1000,
      );

      // calculate week number
      const yearStart = new Date(Date.UTC(monday.getUTCFullYear(), 0, 1));
      const week = Math.ceil(((monday - yearStart) / 86400000 + 1) / 7);

      const weekYear = monday.getUTCFullYear();

      return {
        type: "DATE_BUCKET",
        unit,
        key: weekYear * 100 + week,
        value: weekStartSec,
        year: weekYear,
        week,
      };
    }

    default:
      return {
        type: "DATE_BUCKET",
        unit: "raw",
        key: value,
        value,
      };
  }
}

function getTimeBucket(value, unit) {
  if (value == null) return { type: "EMPTY" };

  if (unit === "hour") {
    const hour = Math.floor(value / 60);

    return {
      type: "TIME_BUCKET",
      unit: "hour",
      value: hour, //  raw hour (0–23)
    };
  }

  return { type: "OTHER" };
}

function splitIntoBuckets(range, parts = 5) {
  const step = (range.to - range.from) / parts;
  const buckets = [];

  for (let i = 0; i < parts; i++) {
    const start = range.from + step * i;
    const end = range.from + step * (i + 1);

    buckets.push({
      from: start,
      to: end,
    });
  }

  return buckets;
}

export { getDateBucket, getTimeBucket, splitIntoBuckets };

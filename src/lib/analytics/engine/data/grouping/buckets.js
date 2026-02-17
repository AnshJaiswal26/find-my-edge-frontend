function getDateBucket(value, unit) {
  if (value == null) return null;

  const d = new Date(value * 86400000);

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();

  switch (unit) {
    case "day":
      return {
        type: "DATE_BUCKET",
        unit,
        key: value, // grouping
        value, // ✅ days (correct)
      };

    case "month": {
      const monthStartDays = Math.floor(Date.UTC(year, month, 1) / 86400000);

      return {
        type: "DATE_BUCKET",
        unit,
        key: year * 12 + month, // grouping key
        value: monthStartDays, // ✅ real date (days)
        year,
        month,
      };
    }

    case "year": {
      const yearStartDays = Math.floor(Date.UTC(year, 0, 1) / 86400000);

      return {
        type: "DATE_BUCKET",
        unit,
        key: year,
        value: yearStartDays, // ✅ real date (days)
        year,
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

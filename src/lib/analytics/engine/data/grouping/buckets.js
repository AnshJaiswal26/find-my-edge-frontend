import { formatDate, formatTime, formatValue } from "@utils";

function getDateBucket(value, unit, { display }) {
  const normalized = formatDate(value, "YYYY-MM-DD");
  if (!normalized || normalized === "—") {
    return "Invalid date";
  }

  switch (unit) {
    case "day": {
      return formatDate(value, display?.format ?? "YYYY-MM-DD");
    }

    case "month": {
      return formatDate(value, "MMM YYYY");
    }

    case "year": {
      return formatDate(value, "YYYY");
    }

    default:
      return "Unknown";
  }
}

function getTimeBucket(value, unit, { display }) {
  if (value == null) return "Empty";
  if (unit === "hour") {
    const hour = Math.floor(value / 60);
    return formatTime(hour, display?.format ?? "HH:mm:ss");
  }
}

function splitIntoBuckets(range, parts = 5, { type, display }) {
  const step = (range.to - range.from) / parts;
  const buckets = [];

  for (let i = 0; i < parts; i++) {
    const start = Math.round(range.from + step * i);
    const end = Math.round(range.from + step * (i + 1));
    buckets.push({
      from: formatValue(start, type, display),
      to: formatValue(end, type, display),
    });
  }

  return buckets;
}

export { getDateBucket, getTimeBucket, splitIntoBuckets };

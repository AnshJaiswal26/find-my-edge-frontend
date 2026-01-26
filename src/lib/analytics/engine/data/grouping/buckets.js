import { formatDate } from "@utils";

function getDateBucket(value, unit, format) {
  const normalized = formatDate(value, "YYYY-MM-DD");
  if (!normalized || normalized === "—") {
    return "Invalid date";
  }

  switch (unit) {
    case "day": {
      return formatDate(value, format ?? "YYYY-MM-DD");
    }

    case "month": {
      return formatDate(value, format ?? "MMM YYYY");
    }

    case "year": {
      return formatDate(value, format ?? "YYYY");
    }

    default:
      return "Unknown";
  }
}

function getTimeBucket(value, unit) {
  if (value == null) return "Empty";
  if (unit === "hour") {
    const hour = Math.floor(value / 60);
    return `${String(hour).padStart(2, "0")}:00`;
  }
}

function splitIntoBuckets(range, parts = 5) {
  const step = (range.to - range.from) / parts;
  const buckets = [];

  for (let i = 0; i < parts; i++) {
    const start = Math.round(range.from + step * i);
    const end = Math.round(range.from + step * (i + 1));
    buckets.push({ from: start, to: end });
  }

  return buckets;
}

export { getDateBucket, getTimeBucket, splitIntoBuckets };

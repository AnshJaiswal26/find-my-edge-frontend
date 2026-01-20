import { formatDate } from "@utils";

export function getDateBucket(value, granularity, displayFormat) {
  // Canonical normalized date (stable, sortable)
  const normalized = formatDate(value, "YYYY-MM-DD");
  if (!normalized || normalized === "—") {
    return { groupId: "__INVALID__", label: "Invalid date" };
  }

  const [year, month, day] = normalized.split("-");

  switch (granularity) {
    case "day": {
      return {
        groupId: `${year}-${month}-${day}`,
        label: formatDate(value, displayFormat ?? "YYYY-MM-DD"),
      };
    }

    case "month": {
      return {
        groupId: `${year}-${month}`,
        label: formatDate(value, displayFormat ?? "MMM YYYY"),
      };
    }

    case "year": {
      return {
        groupId: year,
        label: formatDate(value, displayFormat ?? "YYYY"),
      };
    }

    default:
      return { groupId: "__UNKNOWN__", label: "Unknown" };
  }
}

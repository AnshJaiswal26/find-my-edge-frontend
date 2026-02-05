export function createCell(column) {
  let value = null;

  switch (column.type) {
    case "number":
    case "number computed":
      value = 0;
      break;

    case "time":
    case "time computed":
      value = 0;
      break;

    case "date":
      value = new Date().toISOString().slice(0, 10);
      break;

    case "text":
      value = "-";
      break;

    case "select": {
      value = column?.options?.[0] ?? "-";
      break;
    }

    default:
      value = null;
  }

  return {
    value,
    meta: {},
  };
}

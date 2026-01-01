export function createCell(column) {
  let value = null;

  switch (column.type) {
    case "number":
    case "computed":
      value = 0;
    case "date":
      value = new Date().toISOString().slice(0, 10);
    case "text":
      value = "-";
    case "select":
      value = "";
    default:
      value = null;
  }

  return {
    value,
    meta: {},
  };
}

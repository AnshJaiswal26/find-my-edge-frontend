import { createCell } from "./createCell";

export function createRow(columnsById) {
  const cells = {};

  Object.values(columnsById).forEach((column) => {
    cells[column.id] = createCell(column);
  });

  return {
    id: crypto.randomUUID(),
    cells,
  };
}

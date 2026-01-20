import { createCell } from "./createCell";

export function createRow(columnsById, id) {
  const cells = {};

  Object.values(columnsById).forEach((column) => {
    cells[column.id] = createCell(column);
  });

  return { id, cells };
}

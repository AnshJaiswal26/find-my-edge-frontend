import { createCell } from "./createCell";

export function createRow(columnsById, id) {
  const cells = {};
  const trade = {};

  Object.values(columnsById).forEach((column) => {
    const cell = createCell(column);
    cells[column.id] = cell;
    trade[column.id] = cell.value;
  });

  return { row: { id, highlight: false, cells }, trade };
}

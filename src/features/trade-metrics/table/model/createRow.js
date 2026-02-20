import { createCellValue } from "./createValueCell";

export function createRow(columnsById) {
  const trade = {};

  Object.values(columnsById).forEach((column) => {
    const value = createCellValue(column);
    trade[column.id] = value;
  });

  return trade;
}

export function evaluateExpression(expr, row, prev = 0) {
  switch (expr.type) {
    case "constant":
      return expr.value;

    case "column": {
      const cell = row.cells[expr.columnId];
      return cell?.value ?? null;
    }

    case "unary": {
      const value = evaluateExpression(expr.arg, row, prev);
      if (value == null) return null;

      switch (expr.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case "prev": {
      return prev + row.cells[expr.columnId]?.value ?? null;
    }

    case "binary": {
      const left = evaluateExpression(expr.left, row, prev);
      const right = evaluateExpression(expr.right, row, prev);

      if (left == null || right == null) return null;

      switch (expr.op) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return right === 0 ? null : left / right;
        default:
          return null;
      }
    }

    default:
      return null;
  }
}

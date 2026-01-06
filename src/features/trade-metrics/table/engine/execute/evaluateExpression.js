import { FUNCTION_REGISTRY } from "../functions/registry";

export function evaluateExpression(expr, row, ctx = {}) {
  switch (expr.type) {
    case "constant":
      return expr.value;

    case "column": {
      const cell = row.cells[expr.columnId];
      return cell?.value ?? null;
    }

    case "unary": {
      const value = evaluateExpression(expr.arg, row, ctx);
      if (value == null) return null;

      switch (expr.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case "binary": {
      const left = evaluateExpression(expr.left, row, ctx);
      const right = evaluateExpression(expr.right, row, ctx);

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

        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        case "==":
          return left === right;
        case "!=":
          return left !== right;

        default:
          return null;
      }
    }

    case "function": {
      const impl = FUNCTION_REGISTRY[expr.name.toUpperCase()].exec;
      if (!impl) return null;

      return impl(expr, row, {
        ...ctx,
        evaluate: evaluateExpression,
      });
    }

    default:
      return null;
  }
}

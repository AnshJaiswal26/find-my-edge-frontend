import { FUNCTION_REGISTRY } from "@table/engine/functions/registry";

/* -------------------------------------------------- */
/* MAIN EVALUATOR                                     */
/* -------------------------------------------------- */

export function evaluateExpression(expr, ctx = {}) {
  switch (expr.type) {
    case "constant":
      return expr.value;

    case "key": {
      return ctx.getValue(expr.key);
    }

    case "unary": {
      const value = evaluateExpression(expr.arg, ctx);
      if (value == null) return null;

      switch (expr.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case "binary": {
      const left = evaluateExpression(expr.left, ctx);
      const right = evaluateExpression(expr.right, ctx);

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
      const entry = FUNCTION_REGISTRY[expr.name.toUpperCase()];
      if (!entry?.exec) return null;

      return entry.exec(expr, ctx);
    }

    default:
      return null;
  }
}

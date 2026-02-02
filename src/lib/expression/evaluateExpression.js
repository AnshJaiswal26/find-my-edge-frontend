import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import {
  runBackwardWindowReducer,
  runBaseReducer,
} from "@lib/analytics/runners";

const runReducers = {
  base: runBaseReducer,
  window: runBackwardWindowReducer,
};

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

        case "AND":
          return left && right ? 1 : 0;
        case "OR":
          return left || right ? 1 : 0;

        case ">":
          return left > right ? 1 : 0;
        case "<":
          return left < right ? 1 : 0;
        case ">=":
          return left >= right ? 1 : 0;
        case "<=":
          return left <= right ? 1 : 0;
        case "==":
          return left === right ? 1 : 0;
        case "!=":
          return left !== right ? 1 : 0;

        default:
          return null;
      }
    }

    case "function": {
      const entry = FUNCTION_REGISTRY[expr.name.toUpperCase()];
      if (!entry?.exec && !entry?.reducer) return null;

      return entry?.reducer
        ? runReducers[entry.type](entry.reducer, expr, ctx)
        : entry.exec(expr, ctx);
    }

    default:
      return null;
  }
}

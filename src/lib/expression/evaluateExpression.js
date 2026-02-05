import { COMPUTATION_MODE } from "@lib/analytics/engine/execute";
import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { FUNCTION_TYPE } from "@lib/analytics/engine/functions/type";
import {
  runWindowReducer,
  runBaseReducer,
  runAggregateReducer,
  runNativeWindowReducer,
  runNativeAggregateReducer,
} from "@lib/analytics/runners";
import { deformatValue } from "@utils";

const runReducers = {
  BASE: runBaseReducer,
  WINDOW: runWindowReducer,
  GLOBAL: runAggregateReducer,
  RATIO: runAggregateReducer,
  NATIVE_WINDOW: runNativeWindowReducer,
  NATIVE_AGG: runNativeAggregateReducer,
};

const DEFORMAT_CACHE = new Map();
// key format → `${kind}|${format}|${value}`

function deformatWithCache(value, format, kind) {
  const key = `${kind}|${format}|${value}`;

  if (DEFORMAT_CACHE.has(key)) {
    return DEFORMAT_CACHE.get(key);
  }

  const parsed = deformatValue(value, format, kind);
  DEFORMAT_CACHE.set(key, parsed);
  return parsed;
}

const normalizeInput = (left, right, format, kind) => {
  if (typeof left === "number" && typeof right === "string") {
    return [left, deformatWithCache(right, format, kind)];
  }

  if (typeof right === "number" && typeof left === "string") {
    return [deformatWithCache(left, format, kind), right];
  }

  return [left, right];
};

const SCHEMA_TYPE_CACHE = new Map(); // key → schema key

function getOperandSchemaType(node, ctx) {
  if (node.type !== "key") return null;

  if (SCHEMA_TYPE_CACHE.has(node.key)) {
    return SCHEMA_TYPE_CACHE.get(node.key);
  }

  const type = ctx.getSchemaType(node.key);
  SCHEMA_TYPE_CACHE.set(node.key, type);
  return type;
}

/* -------------------------------------------------- */
/* MAIN EVALUATOR                                     */
/* -------------------------------------------------- */

export function evaluateExpression(expr, ctx = {}) {
  // console.log({ ...expr }, ctx);
  if (!expr || typeof expr !== "object") return null;

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
        case "/": {
          return right === 0 ? null : left / right;
        }

        case "AND":
          return left && right ? 1 : 0;
        case "OR":
          return left || right ? 1 : 0;

        case ">":
        case "<":
        case ">=":
        case "<=":
        case "==":
        case "!=": {
          let l = evaluateExpression(expr.left, ctx);
          let r = evaluateExpression(expr.right, ctx);

          if (l == null || r == null) return null;

          const leftType = getOperandSchemaType(expr.left, ctx);
          const rightType = getOperandSchemaType(expr.right, ctx);

          const schemaType = leftType || rightType; // whichever is a column

          if (schemaType) {
            [l, r] = normalizeInput(l, r, schemaType.format, schemaType.type);
          }

          switch (expr.op) {
            case "==":
              return l === r ? 1 : 0;
            case "!=":
              return l !== r ? 1 : 0;
            case ">":
              return l > r ? 1 : 0;
            case "<":
              return l < r ? 1 : 0;
            case ">=":
              return l >= r ? 1 : 0;
            case "<=":
              return l <= r ? 1 : 0;
          }
        }

        default:
          return null;
      }
    }

    case "function": {
      const entry = FUNCTION_REGISTRY[expr.name.toUpperCase()];
      if (!entry?.exec && !entry?.reducer) return null;

      console.log(entry);

      // // 🚨 Prevent aggregate reducers from running in row mode
      // if (
      //   entry.reducer &&
      //   ctx.mode !== COMPUTATION_MODE.AGGREGATE &&
      //   entry.type !== FUNCTION_TYPE.WINDOW &&
      //   entry.type !== FUNCTION_TYPE.NATIVE_WINDOW
      // ) {
      //   return null;
      // }

      return entry?.reducer
        ? runReducers[entry.type](entry.reducer, expr, ctx)
        : entry.exec(expr, ctx);
    }

    default:
      return null;
  }
}

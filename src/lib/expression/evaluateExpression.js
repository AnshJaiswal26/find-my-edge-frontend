import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions";
import {
  runWindowReducer,
  runBaseReducer,
  runAggregateReducer,
  runNativeWindowReducer,
  runNativeAggregateReducer,
} from "@lib/analytics/runners";
import { deformatValue } from "@shared/utils";

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

export function evaluateExpression(ast, ctx = {}) {
  if (!ast || typeof ast !== "object") return null;

  switch (ast.type) {
    case "constant":
      return ast.value;

    case "key": {
      return ctx.getKeyValue(ast.key);
    }

    case "unary": {
      const value = evaluateExpression(ast.arg, ctx);
      if (value == null) return null;

      switch (ast.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case "binary": {
      const left = evaluateExpression(ast.left, ctx);
      const right = evaluateExpression(ast.right, ctx);

      if (left == null || right == null) return null;

      switch (ast.op) {
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
          let l = evaluateExpression(ast.left, ctx);
          let r = evaluateExpression(ast.right, ctx);

          if (l == null || r == null) return null;

          const leftType = getOperandSchemaType(ast.left, ctx);
          const rightType = getOperandSchemaType(ast.right, ctx);

          const schemaType = leftType || rightType; // whichever is a column

          if (schemaType) {
            [l, r] = normalizeInput(
              l,
              r,
              schemaType.format,
              schemaType.semanticType,
            );
          }

          switch (ast.op) {
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
      const reducer = FUNCTION_REGISTRY[ast.fn.toUpperCase()];

      return reducer?.exec
        ? reducer.exec(ast, ctx)
        : runReducers[reducer.type](reducer, ast, ctx);
    }

    default:
      return null;
  }
}

import { FunctionRegistry } from "@lib/analytics/engine/functions";
import {
  runWindowReducer,
  runAggregateReducer,
  runNativeWindowReducer,
  runNativeAggregateReducer,
} from "@lib/analytics/runners";
import { deformatValue } from "@shared/utils";
import { NodeType } from "./nodeType";
import { FunctionType } from "@lib/analytics/engine/functions/funtionType";
import { ExecutionMode } from "@lib/analytics/engine/functions/executionMode";

const runReducers = {
  WINDOW: runWindowReducer,
  AGGREGATE: runAggregateReducer,
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
  if (node.type !== NodeType.IDENTIFIER) return null;

  if (SCHEMA_TYPE_CACHE.has(node.field)) {
    return SCHEMA_TYPE_CACHE.get(node.field);
  }

  const type = ctx.getSchemaType(node.field);
  SCHEMA_TYPE_CACHE.set(node.field, type);
  return type;
}

/* -------------------------------------------------- */
/* MAIN EVALUATOR                                     */
/* -------------------------------------------------- */

export function evaluateExpression(ast, ctx = {}) {
  if (!ast || typeof ast !== "object") return null;

  switch (ast.type.toUpperCase()) {
    case NodeType.CONSTANT:
      return ast.value;

    case NodeType.IDENTIFIER: {
      return ctx.getKeyValue(ast.field);
    }

    case NodeType.UNARY: {
      const value = evaluateExpression(ast.arg, ctx);
      if (value == null) return null;

      switch (ast.op) {
        case "-":
          return -value;
        default:
          return null;
      }
    }

    case NodeType.BINARY: {
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

    case NodeType.FUNCTION: {
      const fn = FunctionRegistry[ast.fn.toUpperCase()];

      if (fn.type == FunctionType.PURE) {
        if (!fn.exec) return null;
        return fn.exec(ast, ctx);
      }

      let runnerKey;
      if (fn.type == FunctionType.AGGREGATE) {
        runnerKey =
          fn.executionMode == ExecutionMode.NATIVE ? "NATIVE_AGG" : "AGGREGATE";
      } else if (fn.type == FunctionType.WINDOW) {
        runnerKey =
          fn.executionMode == ExecutionMode.NATIVE ? "NATIVE_WINDOW" : "WINDOW";
      } else {
        return null;
      }

      return runReducers[runnerKey](fn, ast, ctx);
    }

    default:
      return null;
  }
}

import { SEMANTIC_TYPE } from "@lib/analytics/schema";
import { validate } from "./validator";

export function validateBinary(node, schemasById) {
  const left = validate(node.left, schemasById);
  const right = validate(node.right, schemasById);

  const op = node.op;

  /* ---------- ARITHMETIC ---------- */
  if (["+", "-", "*", "/"].includes(op)) {
    // DATE - DATE → DURATION
    if (
      op === "-" &&
      left === right &&
      [SEMANTIC_TYPE.DATE, SEMANTIC_TYPE.TIME, SEMANTIC_TYPE.DATETIME].includes(
        left,
      )
    ) {
      return SEMANTIC_TYPE.DURATION;
    }

    // DURATION rules
    if (left === SEMANTIC_TYPE.DURATION && right === SEMANTIC_TYPE.DURATION) {
      if (["+", "-"].includes(op)) return SEMANTIC_TYPE.DURATION;
      if (op === "/") return SEMANTIC_TYPE.NUMBER;
      throw new Error(`Invalid: duration ${op} duration`);
    }

    if (left === SEMANTIC_TYPE.DURATION && right === SEMANTIC_TYPE.NUMBER) {
      if (["*", "/"].includes(op)) return SEMANTIC_TYPE.DURATION;
      throw new Error(`Invalid: duration ${op} number`);
    }

    if (left === SEMANTIC_TYPE.NUMBER && right === SEMANTIC_TYPE.DURATION) {
      if (op === "*") return SEMANTIC_TYPE.DURATION;
      throw new Error(`Invalid: number ${op} duration`);
    }

    // NUMBER
    if (left === SEMANTIC_TYPE.NUMBER && right === SEMANTIC_TYPE.NUMBER) {
      return SEMANTIC_TYPE.NUMBER;
    }

    throw new Error(`Invalid arithmetic: ${left} ${op} ${right}`);
  }

  /* ---------- COMPARISON ---------- */
  if ([">", "<", ">=", "<=", "==", "!="].includes(op)) {
    if (left !== right) {
      throw new Error(`Comparison mismatch: ${left} ${op} ${right}`);
    }
    return SEMANTIC_TYPE.BOOLEAN;
  }

  /* ---------- LOGICAL ---------- */
  if (["AND", "OR"].includes(op)) {
    if (left !== SEMANTIC_TYPE.BOOLEAN || right !== SEMANTIC_TYPE.BOOLEAN) {
      throw new Error(`Logical op requires boolean`);
    }
    return SEMANTIC_TYPE.BOOLEAN;
  }

  throw new Error(`Unknown operator ${op}`);
}

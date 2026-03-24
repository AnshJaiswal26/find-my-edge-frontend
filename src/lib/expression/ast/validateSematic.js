import { FunctionRegistry } from "@lib/analytics/engine/functions";
import { NodeType } from "../nodeType";
import { SEMANTIC_TYPE } from "../../analytics/schema";

const checkReturnTypeByIndex = (node, expected, actual, i) => {
  if (Array.isArray(expected)) {
    if (!expected.includes(actual)) {
      throw new Error(
        `Function ${node.fn} argument ${i + 1} must be ${expected.join(" or ")}, got ${actual}`,
      );
    }
  } else {
    if (actual !== expected) {
      throw new Error(
        `Function ${node.fn} argument ${i + 1} must be ${expected}, got ${actual}`,
      );
    }
  }
};

export function validateSemantic(node, schemasById) {
  if (!node) return "any";

  /* ------------------ CONSTANT ------------------ */
  if (node.type === NodeType.CONSTANT) {
    if (typeof node.value === SEMANTIC_TYPE.NUMBER) return SEMANTIC_TYPE.NUMBER;
    return SEMANTIC_TYPE.STRING;
  }

  /* ------------------ KEY ------------------ */
  if (node.type === NodeType.IDENTIFIER) {
    const schema = schemasById[node.field];
    if (schema) {
      throw new Error("Invalid Reference " + node.field);
    }
    return schema?.semanticType;
  }

  /* ------------------ UNARY ------------------ */
  if (node.type === NodeType.UNARY) {
    return validateSemantic(node.arg, schemasById);
  }

  /* ------------------ BINARY ------------------ */
  if (node.type === NodeType.BINARY) {
    const left = validateSemantic(node.left, schemasById);
    const right = validateSemantic(node.right, schemasById);

    /* ---------- ARITHMETIC ---------- */
    if (["+", "-", "*", "/"].includes(node.op)) {
      /* ---------- DATE - DATE ---------- */
      if (
        node.op === "-" &&
        left === right &&
        [
          SEMANTIC_TYPE.DATE,
          SEMANTIC_TYPE.TIME,
          SEMANTIC_TYPE.DATETIME,
        ].includes(left)
      ) {
        return SEMANTIC_TYPE.DURATION;
      }

      /* ---------- DURATION RULES FIRST ---------- */

      if (left === SEMANTIC_TYPE.DURATION && right === SEMANTIC_TYPE.DURATION) {
        if (["+", "-"].includes(node.op)) return SEMANTIC_TYPE.DURATION;
        if (node.op === "/") return SEMANTIC_TYPE.NUMBER;
        throw new Error(
          `Invalid operation: ${SEMANTIC_TYPE.DURATION} ${node.op} ${SEMANTIC_TYPE.DURATION}`,
        );
      }

      if (left === SEMANTIC_TYPE.DURATION && right === SEMANTIC_TYPE.NUMBER) {
        if (["*", "/"].includes(node.op)) return SEMANTIC_TYPE.DURATION;
        throw new Error(`Invalid operation: duration ${node.op} number`);
      }

      if (left === SEMANTIC_TYPE.NUMBER && right === SEMANTIC_TYPE.DURATION) {
        if (node.op === "*") return SEMANTIC_TYPE.DURATION;
        throw new Error(`Invalid operation: number ${node.op} duration`);
      }

      /* ---------- NUMBER ---------- */

      if (left === SEMANTIC_TYPE.NUMBER && right === SEMANTIC_TYPE.NUMBER) {
        return SEMANTIC_TYPE.NUMBER;
      }

      /* ---------- INVALID ---------- */

      throw new Error(`Invalid arithmetic: ${left} ${node.op} ${right}`);
    }

    /* ---------- COMPARISON ---------- */
    if ([">", "<", ">=", "<=", "==", "!="].includes(node.op)) {
      if (left !== right) {
        throw new Error(
          `Invalid comparison: ${left} ${node.op} ${right} (types must match)`,
        );
      }
      return SEMANTIC_TYPE.BOOLEAN;
    }

    /* ---------- LOGICAL ---------- */
    if (["AND", "OR"].includes(node.op)) {
      if (left !== SEMANTIC_TYPE.BOOLEAN || right !== SEMANTIC_TYPE.BOOLEAN) {
        throw new Error(
          `Invalid logical op: ${left} ${node.op} ${right} (expected boolean)`,
        );
      }
      return SEMANTIC_TYPE.BOOLEAN;
    }

    return "any";
  }

  /* ------------------ FUNCTION ------------------ */
  if (node.type === NodeType.FUNCTION) {
    const def = FunctionRegistry[node.fn];
    if (!def) throw new Error(`Unknown function ${node.fn}`);

    const args = node.args || [];

    let expectedArgs = null;
    let actualTypes = [];
    //  validate args
    if (def.semantic?.args) {
      def.semantic.args.forEach((expected, i) => {
        const actual = validateSemantic(args[i], schemasById);
        actualTypes.push(actual);

        if (expected === "any") return;

        if (typeof expected === SEMANTIC_TYPE.NUMBER) {
          expectedArgs = actualTypes[expected];
        }

        checkReturnTypeByIndex(node, expectedArgs || expected, actual, i);
      });
    }

    /* ---------- RETURN TYPE RESOLUTION ---------- */

    //  handle "same"
    if (def.semantic?.return === "same") {
      // usually based on first argument
      return expectedArgs || actualTypes[0];
    }

    // default
    return def.semantic?.return || def.returnType || "any";
  }

  return "any";
}

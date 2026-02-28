import { FunctionRegistry } from "@lib/analytics/engine/functions";
import { NodeType } from "../nodeType";

export function validateSemantic(node, schemasById) {
  if (!node) return "any";

  /* ------------------ CONSTANT ------------------ */
  if (node.type === NodeType.CONSTANT) {
    if (typeof node.value === "number") return "number";
    if (typeof node.value === "string") return "string";
    return "any";
  }

  /* ------------------ KEY ------------------ */
  if (node.type === NodeType.IDENTIFIER) {
    const schema = schemasById[node.field];
    return schema?.semanticType || "any";
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
        ["date", "time", "datetime"].includes(left)
      ) {
        return "duration";
      }

      /* ---------- DURATION RULES FIRST ---------- */

      if (left === "duration" && right === "duration") {
        if (["+", "-"].includes(node.op)) return "duration";
        if (node.op === "/") return "number";
        throw new Error(`Invalid operation: duration ${node.op} duration`);
      }

      if (left === "duration" && right === "number") {
        if (["*", "/"].includes(node.op)) return "duration";
        throw new Error(`Invalid operation: duration ${node.op} number`);
      }

      if (left === "number" && right === "duration") {
        if (node.op === "*") return "duration";
        throw new Error(`Invalid operation: number ${node.op} duration`);
      }

      /* ---------- NUMBER ---------- */

      if (left === "number" && right === "number") {
        return "number";
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
      return "boolean";
    }

    /* ---------- LOGICAL ---------- */
    if (["AND", "OR"].includes(node.op)) {
      if (left !== "boolean" || right !== "boolean") {
        throw new Error(
          `Invalid logical op: ${left} ${node.op} ${right} (expected boolean)`,
        );
      }
      return "boolean";
    }

    return "any";
  }

  /* ------------------ FUNCTION ------------------ */
  if (node.type === NodeType.FUNCTION) {
    const def = FunctionRegistry[node.fn];
    if (!def) throw new Error(`Unknown function ${node.fn}`);

    const args = node.args || [];

    //  validate args
    if (def.semantic?.args) {
      def.semantic.args.forEach((expected, i) => {
        const actual = validateSemantic(args[i], schemasById);

        if (expected === "any") return;

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
      });
    }

    /* ---------- RETURN TYPE RESOLUTION ---------- */

    //  handle "same"
    if (def.semantic?.return === "same") {
      // usually based on first argument
      return validateSemantic(args[0], schemasById);
    }

    // default
    return def.semantic?.return || def.returnType || "any";
  }

  return "any";
}

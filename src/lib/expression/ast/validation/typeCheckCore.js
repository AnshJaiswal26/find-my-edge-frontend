/* ------------------ CONSTANT ------------------ */
import { SEMANTIC_TYPE } from "@lib/analytics/schema";

function inferConstant(value) {
  if (typeof value === "number") return SEMANTIC_TYPE.NUMBER;
  if (typeof value === "string") return SEMANTIC_TYPE.STRING;
  if (typeof value === "boolean") return SEMANTIC_TYPE.BOOLEAN;

  throw new Error(`Unsupported constant type: ${value}`);
}

/* ------------------ FIELD ------------------ */
function resolveField(node, schemasById) {
  const schema = schemasById[node.field];

  if (!schema) {
    throw new Error(`Unknown field: ${node.field}`);
  }

  return schema.semanticType;
}

/* ------------------ GENERIC RESOLVER ------------------ */
function resolveExpected(expected, actual, typeEnv, generics, fnName, index) {
  // GENERIC
  if (typeof expected === "string" && expected.startsWith("$")) {
    const constraint = generics?.[expected];

    if (constraint && !constraint.includes(actual)) {
      throw new Error(
        `Function ${fnName} arg ${index + 1}: ${actual} not allowed for ${expected}`,
      );
    }

    if (!typeEnv[expected]) {
      typeEnv[expected] = actual;
      return;
    }

    if (typeEnv[expected] !== actual) {
      throw new Error(
        `Function ${fnName} arg ${index + 1}: expected ${typeEnv[expected]} but got ${actual}`,
      );
    }

    return;
  }

  // Union
  if (Array.isArray(expected)) {
    if (!expected.includes(actual)) {
      throw new Error(
        `Function ${fnName} arg ${index + 1}: expected ${expected.join(" | ")} but got ${actual}`,
      );
    }
    return;
  }

  // Exact match
  if (expected !== actual) {
    throw new Error(
      `Function ${fnName} arg ${index + 1}: expected ${expected} but got ${actual}`,
    );
  }
}

export { inferConstant, resolveField, resolveExpected };

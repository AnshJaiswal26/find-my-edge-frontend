import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";

function getSemanticType(node, schemasById) {
  if (!node) return "any";

  /* ------------------ CONSTANT ------------------ */
  if (node.type === "constant") {
    if (typeof node.value === "number") return "number";
    if (typeof node.value === "string") return "string";
    return "any";
  }

  /* ------------------ KEY ------------------ */
  if (node.type === "key") {
    const schema = schemasById[node.key];
    if (!schema) return "any";

    return schema.semanticType || "any"; // 🔥 use semanticType directly
  }

  /* ------------------ FUNCTION ------------------ */
  if (node.type === "function") {
    const def = FUNCTION_REGISTRY[node.name];
    return def?.returnType || "any";
  }

  /* ------------------ UNARY ------------------ */
  if (node.type === "unary") {
    return getSemanticType(node.arg, schemasById);
  }

  /* ------------------ BINARY ------------------ */
  if (node.type === "binary") {
    const left = getSemanticType(node.left, schemasById);
    const right = getSemanticType(node.right, schemasById);

    /* ---------- COMPARISON ---------- */
    if ([">", "<", ">=", "<=", "==", "!="].includes(node.op)) {
      return "boolean";
    }

    /* ---------- LOGICAL ---------- */
    if (["AND", "OR"].includes(node.op)) {
      return "boolean";
    }

    /* ---------- DATE / TIME DIFF ---------- */
    if (node.op === "-") {
      if (
        (left === "date" && right === "date") ||
        (left === "time" && right === "time") ||
        (left === "datetime" && right === "datetime")
      ) {
        return "duration";
      }
    }

    /* ---------- NUMERIC ---------- */
    if (left === "number" && right === "number") {
      return "number";
    }

    /* ---------- DURATION MATH ---------- */
    if (left === "duration" && right === "duration") {
      return "duration";
    }

    /* ---------- INVALID ---------- */
    return "any"; // or throw error (better handled in validateTypes)
  }

  return "any";
}

export function validateSemantic(node, schemasById) {
  if (!node) return "any";

  /* ------------------ CONSTANT ------------------ */
  if (node.type === "constant") {
    if (typeof node.value === "number") return "number";
    if (typeof node.value === "string") return "string";
    return "any";
  }

  /* ------------------ KEY ------------------ */
  if (node.type === "key") {
    const schema = schemasById[node.key];
    console.log(node.key);
    return schema?.semanticType || "any";
  }

  /* ------------------ UNARY ------------------ */
  if (node.type === "unary") {
    return validateSemantic(node.arg, schemasById);
  }

  /* ------------------ BINARY ------------------ */
  if (node.type === "binary") {
    const left = validateSemantic(node.left, schemasById);
    const right = validateSemantic(node.right, schemasById);

    if (["+", "-", "*", "/"].includes(node.op)) {
      if (left !== right) {
        throw new Error(`Invalid operation: ${left} ${node.op} ${right}`);
      }
    }

    /* ---------- TYPE INFERENCE ---------- */
    if ([">", "<", ">=", "<=", "==", "!="].includes(node.op)) {
      return "boolean";
    }

    if (["AND", "OR"].includes(node.op)) {
      return "boolean";
    }

    if (node.op === "-") {
      if (left === right && ["date", "time", "datetime"].includes(left)) {
        return "duration";
      }
    }

    if (left === "number" && right === "number") return "number";
    if (left === "duration" && right === "duration") return "duration";

    return "any";
  }

  /* ------------------ FUNCTION ------------------ */
  if (node.type === "function") {
    const def = FUNCTION_REGISTRY[node.name];
    if (!def) throw new Error(`Unknown function ${node.name}`);

    const args = node.args || [];

    // ✅ validate args
    if (def.semantic?.args) {
      def.semantic.args.forEach((expected, i) => {
        const actual = validateSemantic(args[i], schemasById);

        if (expected === "any") return;

        if (Array.isArray(expected)) {
          if (!expected.includes(actual)) {
            throw new Error(
              `Function ${node.name} argument ${i + 1} must be ${expected.join(" or ")}, got ${actual}`,
            );
          }
        } else {
          if (actual !== expected) {
            throw new Error(
              `Function ${node.name} argument ${i + 1} must be ${expected}, got ${actual}`,
            );
          }
        }
      });
    }

    // ✅ return type
    return def.semantic?.returnType || def.returnType || "any";
  }

  return "any";
}

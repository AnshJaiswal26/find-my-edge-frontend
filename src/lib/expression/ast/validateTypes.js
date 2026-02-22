import {
  FUNCTION_REGISTRY,
  FUNCTION_ALLOW_BY_MODE,
} from "@lib/analytics/engine/functions";

function getNodeType(node, mode, schemasById) {
  if (!node) return "any";

  if (node.type === "constant") {
    if (typeof node.value === "number") return "number";
    if (typeof node.value === "string") return "string";
    return "any";
  }

  if (node.type === "key") {
    if (!schemasById) return "any";

    const schema = schemasById[node.key];

    if (!schema) {
      throw new Error(`Unknown field reference: ${node.key}`);
    }

    switch (schema.type) {
      case "number":
      case "duration":
      case "time":
      case "date":
      case "datetime":
        return "number";

      case "select":
      case "text":
        return "string";

      case "boolean":
        return "boolean";

      default:
        return "any";
    }
  }

  if (node.type === "unary") {
    const t = getNodeType(node.arg, mode, schemasById);
    if (node.op === "-" && t !== "number") {
      throw new Error("Unary minus requires a number");
    }
    return "number";
  }

  if (node.type === "binary") {
    const left = getNodeType(node.left, mode, schemasById);
    const right = getNodeType(node.right, mode, schemasById);

    if (["+", "-", "*", "/"].includes(node.op)) {
      // existing numeric check (execution level)
      if (left !== "number" || right !== "number") {
        throw new Error(`Operator ${node.op} requires numeric operands`);
      }

      return "number";
    }

    if (["==", "!=", ">", "<", ">=", "<="].includes(node.op)) {
      return "boolean";
    }

    if (["AND", "OR"].includes(node.op)) {
      if (left !== "boolean" || right !== "boolean") {
        throw new Error(`${node.op} requires boolean operands`);
      }
      return "boolean";
    }
  }

  if (node.type === "function") {
    const def = FUNCTION_REGISTRY[node.fn];
    if (!def) throw new Error(`Unknown function ${node.fn}`);

    // Mode permission check
    if (mode) {
      const allowed = FUNCTION_ALLOW_BY_MODE[mode];
      if (!allowed?.has(node.fn)) {
        throw new Error(
          `Function ${node.fn} is not allowed in ${mode} computation`,
        );
      }
    }

    const argTypes = def.argTypes || [];
    const args = node.args || [];

    for (let i = 0; i < argTypes.length; i++) {
      const expected = argTypes[i];
      const actual = getNodeType(args[i], mode, schemasById);

      if (expected === "any") continue;

      if (typeof expected === "object" && expected.key) {
        if (args[i]?.type !== "key") {
          throw new Error(
            `Function ${node.fn} argument ${i + 1} must be a field reference`,
          );
        }

        const keyType = getNodeType(args[i], mode, schemasById);

        if (expected.key !== "any" && keyType !== expected.key) {
          throw new Error(
            `Function ${node.fn} argument ${i + 1} must reference a ${expected.key} field`,
          );
        }
        continue;
      }

      // Union type support
      if (Array.isArray(expected)) {
        if (!expected.includes(actual)) {
          throw new Error(
            `Function ${node.fn} argument ${i + 1} must be ${expected.join(" or ")}`,
          );
        }
      } else {
        if (expected !== actual) {
          throw new Error(
            `Function ${node.fn} argument ${i + 1} must be ${expected}`,
          );
        }
      }
    }

    return def.returnType || "any";
  }

  return "any";
}

export function validateTypes(ast, mode, schemasById) {
  getNodeType(ast, mode, schemasById);
}

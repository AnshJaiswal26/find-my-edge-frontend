import {
  FUNCTION_REGISTRY,
  FUNCTION_ALLOW_BY_MODE,
} from "@lib/analytics/engine/functions/registry";

function getNodeType(node, mode) {
  if (!node) return "any";

  if (node.type === "constant") {
    if (typeof node.value === "number") return "number";
    if (typeof node.value === "string") return "string";
    return "any";
  }

  if (node.type === "key") {
    return "number"; // or derive from schema later
  }

  if (node.type === "unary") {
    const t = getNodeType(node.arg);
    if (node.op === "-" && t !== "number") {
      throw new Error("Unary minus requires a number");
    }
    return "number";
  }

  if (node.type === "binary") {
    const left = getNodeType(node.left);
    const right = getNodeType(node.right);

    if (["+", "-", "*", "/"].includes(node.op)) {
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
    const def = FUNCTION_REGISTRY[node.name];
    if (!def) throw new Error(`Unknown function ${node.name}`);

    // 🔹 Mode permission check
    if (mode) {
      const allowed = FUNCTION_ALLOW_BY_MODE[mode];
      if (!allowed?.has(node.name)) {
        throw new Error(
          `Function ${node.name} is not allowed in ${mode} computation`,
        );
      }
    }

    const argTypes = def.argTypes || [];
    const args = node.args || [];

    for (let i = 0; i < argTypes.length; i++) {
      const expected = argTypes[i];
      const actual = getNodeType(args[i]);

      if (expected !== "any" && expected !== actual) {
        throw new Error(
          `Function ${node.name} argument ${i + 1} must be ${expected}`,
        );
      }
    }

    return def.returnType || "any";
  }

  return "any";
}

export function validateTypes(ast, mode) {
  getNodeType(ast, mode);
}

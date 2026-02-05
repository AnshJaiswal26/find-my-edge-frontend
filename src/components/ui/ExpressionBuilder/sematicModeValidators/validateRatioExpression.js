import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { FUNCTION_TYPE } from "@lib/analytics/engine/functions/type";

function isRatioFunction(name) {
  const fn = FUNCTION_REGISTRY[name];
  return (
    fn?.type === FUNCTION_TYPE.RATIO || fn?.type === FUNCTION_TYPE.NATIVE_AGG
  );
}

export function validateRatioExpression(ast, schemasById) {
  if (!ast) throw new Error("Expression is empty");

  if (ast.type === "function" && isRatioFunction(ast.name)) {
    return;
  }

  if (!isDivision(ast)) {
    throw new Error("Radial charts require a ratio (use division A / B)");
  }

  const { left, right } = ast;

  ensureNumeric(left, schemasById, "Numerator");
  ensureNumeric(right, schemasById, "Denominator");

  if (isConstantExpression(right)) {
    throw new Error("Denominator cannot be a constant");
  }

  if (!containsAggregate(left) || !containsAggregate(right)) {
    throw new Error(
      "Both numerator and denominator must contain an aggregate function",
    );
  }
}

function isDivision(node) {
  return node?.type === "binary" && node.op === "/";
}

function containsAggregate(node) {
  if (!node) return false;

  if (node.type === "function") {
    return FUNCTION_REGISTRY[node.name]?.type === "GLOBAL";
  }

  if (node.type === "binary" || node.type === "unary") {
    return (
      containsAggregate(node.left) ||
      containsAggregate(node.right) ||
      containsAggregate(node.arg)
    );
  }

  return false;
}

function ensureNumeric(node, schemasById, label) {
  if (!isNumericExpression(node, schemasById)) {
    throw new Error(`${label} must be numeric`);
  }
}

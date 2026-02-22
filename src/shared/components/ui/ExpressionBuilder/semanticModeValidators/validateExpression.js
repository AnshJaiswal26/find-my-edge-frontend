import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions";

export function validateExpression(ast) {
  if (!ast) throw new Error("Expression is empty");

  if (hasInvalidFieldUsage(ast, false)) {
    throw new Error(
      "Reference must be used inside aggregate/global functions (e.g., SUM(PnL))",
    );
  }
}

function hasInvalidFieldUsage(node, insideAggregate) {
  if (!node) return false;

  // If it's a function → check if it's aggregate
  if (node.type === "function") {
    const fnType = FUNCTION_REGISTRY[node.fn]?.type;
    const isAggregate =
      fnType === "GLOBAL" || fnType === "NATIVE_AGG" || fnType === "RATIO";

    return node.args?.some((arg) =>
      hasInvalidFieldUsage(arg, insideAggregate || isAggregate),
    );
  }

  // ❗ Field used outside aggregate → INVALID
  if (node.type === "key") {
    return !insideAggregate;
  }

  // Traverse expressions
  if (node.type === "binary") {
    return (
      hasInvalidFieldUsage(node.left, insideAggregate) ||
      hasInvalidFieldUsage(node.right, insideAggregate)
    );
  }

  if (node.type === "unary") {
    return hasInvalidFieldUsage(node.arg, insideAggregate);
  }

  return false;
}

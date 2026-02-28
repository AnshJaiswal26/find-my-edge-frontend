import { FunctionRegistry } from "@lib/analytics/engine/functions";
import { FunctionType } from "@lib/analytics/engine/functions/funtionType";
import { NodeType } from "@lib/expression/nodeType";

export function validateExpression(ast) {
  if (!ast) throw new Error("Expression is empty");

  if (hasInvalidFieldUsage(ast, false)) {
    throw new Error(
      "Reference must be used inside aggregate functions (e.g., SUM(PnL), AVG(PnL), etc.)",
    );
  }
}

function hasInvalidFieldUsage(node, insideAggregate) {
  if (!node) return false;

  // If it's a function → check if it's aggregate
  if (node.type === NodeType.FUNCTION) {
    const fnType = FunctionRegistry[node.fn]?.type;
    const isAggregate = fnType === FunctionType.AGGREGATE;

    return node.args?.some((arg) =>
      hasInvalidFieldUsage(arg, insideAggregate || isAggregate),
    );
  }

  // ❗ Field used outside aggregate → INVALID
  if (node.type === NodeType.IDENTIFIER) {
    return !insideAggregate;
  }

  // Traverse expressions
  if (node.type === NodeType.BINARY) {
    return (
      hasInvalidFieldUsage(node.left, insideAggregate) ||
      hasInvalidFieldUsage(node.right, insideAggregate)
    );
  }

  if (node.type === NodeType.UNARY) {
    return hasInvalidFieldUsage(node.arg, insideAggregate);
  }

  return false;
}

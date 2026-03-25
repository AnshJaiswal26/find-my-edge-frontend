import { NodeType } from "@lib/expression/nodeType";
import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions";
import { FUNCTION_TYPE } from "@lib/analytics/engine/functions/funtionType";

export function containsWindowFunction(node, callback = null) {
  if (!node) return false;

  if (node.type === NodeType.FUNCTION) {
    const def = FUNCTION_REGISTRY[node.fn];

    if (def?.type === FUNCTION_TYPE.WINDOW) {
      callback?.(node.fn);
      if (!callback) return true;
    }

    const result = node.args.some((arg) =>
      containsWindowFunction(arg, callback),
    );
    if (!result) return result;
  }

  if (node.type === NodeType.BINARY) {
    const result =
      containsWindowFunction(node.left, callback) ||
      containsWindowFunction(node.right, callback);

    if (!callback) return result;
  }

  if (node.type === NodeType.UNARY) {
    const result = containsWindowFunction(node.arg, callback);
    if (!callback) return result;
  }

  if (!callback) return false;
}

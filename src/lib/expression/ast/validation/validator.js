import { NodeType } from "../../nodeType";
import { inferConstant, resolveField } from "./typeCheckCore";
import { validateBinary } from "./validateBinary";
import { validateFunction } from "./validateFunction";

export function validate(node, schemasById) {
  if (!node) return null;

  switch (node.type) {
    case NodeType.CONSTANT:
      return inferConstant(node.value);

    case NodeType.IDENTIFIER:
      return resolveField(node, schemasById);

    case NodeType.UNARY:
      return validate(node.arg, schemasById);

    case NodeType.BINARY:
      return validateBinary(node, schemasById);

    case NodeType.FUNCTION:
      return validateFunction(node, schemasById);

    default:
      throw new Error(`Unknown node type ${node.type}`);
  }
}

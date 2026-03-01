import { NodeType } from "@lib/expression/nodeType";

const PRECEDENCE = {
  OR: 1,
  AND: 2,
  "==": 3,
  "!=": 3,
  ">": 3,
  "<": 3,
  ">=": 3,
  "<=": 3,
  "+": 4,
  "-": 4,
  "*": 5,
  "/": 5,
};

function needsParens(parentOp, childNode) {
  if (childNode.type !== NodeType.BINARY) return false;
  return PRECEDENCE[childNode.op] < PRECEDENCE[parentOp];
}

export function formatAST(node, indent = 2, schemasById) {
  const pad = "  ".repeat(indent);

  switch (node.type) {
    case NodeType.CONSTANT:
      return typeof node.value === "string"
        ? `"${node.value}"`
        : String(node.value);

    case NodeType.IDENTIFIER: {
      return `[${schemasById[node.field]?.label}]` ?? "KEY";
    }

    case NodeType.UNARY:
      return node.op + formatAST(node.argument, indent, schemasById);

    case NodeType.BINARY: {
      let left = formatAST(node.left, indent, schemasById);
      let right = formatAST(node.right, indent, schemasById);

      if (needsParens(node.op, node.left)) {
        left = `(${left})`;
      }
      if (needsParens(node.op, node.right)) {
        right = `(${right})`;
      }

      if (node.op === "AND" || node.op === "OR") {
        return `${left}\n${pad}${node.op} ${right}`;
      }

      return `${left} ${node.op} ${right}`;
    }

    case NodeType.FUNCTION: {
      // 🔥 handle empty args (single line)
      if (!node.args || node.args.length === 0) {
        return `${node.fn}()`;
      }

      const args = node.args.map((arg) =>
        formatAST(arg, indent + 1, schemasById),
      );

      return `${node.fn}(\n${pad}  ${args.join(",\n" + pad + "  ")}\n${pad})`;
    }

    default:
      return "";
  }
}

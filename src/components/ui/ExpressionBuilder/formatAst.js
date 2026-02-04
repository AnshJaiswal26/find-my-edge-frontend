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
  if (childNode.type !== "binary") return false;
  return PRECEDENCE[childNode.op] < PRECEDENCE[parentOp];
}

export function formatAST(node, indent = 2, schemasById) {
  const pad = "  ".repeat(indent);

  switch (node.type) {
    case "constant":
      return typeof node.value === "string"
        ? `"${node.value}"`
        : String(node.value);

    case "key": {
      return schemasById[node.key]?.label ?? "KEY";
    }

    case "identifier": {
      return node.name;
    }

    case "unary":
      return node.op + formatAST(node.argument, indent, schemasById);

    case "binary": {
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

    case "function": {
      const args = node.args.map((arg) =>
        formatAST(arg, indent + 1, schemasById),
      );
      return `${node.name}(\n${pad}  ${args.join(",\n" + pad + "  ")}\n${pad})`;
    }

    default:
      return "";
  }
}

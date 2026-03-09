import {
  FunctionRegistry,
  FunctionAllowByMode,
} from "@lib/analytics/engine/functions";
import { FunctionType } from "@lib/analytics/engine/functions/funtionType";
import { NodeType } from "../nodeType";
import { TokenType } from "./tokenType";

function containsWindowFunction(node) {
  if (!node) return false;

  if (node.type === NodeType.FUNCTION) {
    const def = FunctionRegistry[node.name];
    if (def?.type === FunctionType.WINDOW) return true;

    return node.args.some(containsWindowFunction);
  }

  if (node.type === NodeType.BINARY) {
    return (
      containsWindowFunction(node.left) || containsWindowFunction(node.right)
    );
  }

  if (node.type === NodeType.UNARY) {
    return containsWindowFunction(node.arg);
  }

  return false;
}

export function buildAST(postfix, type) {
  // console.log(postfix);

  const stack = [];
  const dependencies = new Set();

  for (const t of postfix) {
    /* ---------- FUNCTION ---------- */
    if (t.type === TokenType.FUNCTION) {
      const name = t.value.toUpperCase();

      // Get function definition (execution behavior)
      const fnDef = FunctionRegistry[name];
      if (!fnDef) {
        throw new Error(`Unknown function ${name}`);
      }

      // Validate function allowed in this computation mode
      if (type) {
        const allowed = FunctionAllowByMode[type];
        if (!allowed?.has(name)) {
          throw new Error(
            `Function ${name} is not allowed in ${type} computation`,
          );
        }
      }

      const arity = fnDef.argTypes.length;

      if (arity == null || arity === undefined) {
        throw new Error(
          `Function ${name} is not suitable for current computation mode`,
        );
      }

      if (stack.length < arity) {
        throw new Error(`Function ${name} expects ${arity} argument(s)`);
      }

      const args = [];
      for (let i = 0; i < arity; i++) {
        const arg = stack.pop();
        if (!arg) {
          throw new Error(`Function ${name} expects ${arity} argument(s)`);
        }
        args.unshift(arg);
      }

      //  Prevent WINDOW inside WINDOW
      if (fnDef?.type === FunctionType.WINDOW) {
        for (const arg of args) {
          if (containsWindowFunction(arg)) {
            throw new Error(
              `Nested rolling/window functions are not allowed inside ${name}`,
            );
          }
        }
      }

      if (fnDef.field) {
        dependencies.add(fnDef.field);
      }

      stack.push({
        type: NodeType.FUNCTION,
        fn: name,
        args,
      });

      continue;
    }

    /* ---------- IDENTIFIER ---------- */
    if (t.type === TokenType.IDENTIFIER) {
      const id = t.value;
      if (!id) return null;

      stack.push({ type: NodeType.IDENTIFIER, field: id });
      dependencies.add(id);
      continue;
    }

    /* ---------- STRING ---------- */
    if (t.type === TokenType.STRING) {
      stack.push({
        type: NodeType.CONSTANT,
        value: t.value,
        valueType: "string",
      });
      continue;
    }

    /* ---------- NUMBER ---------- */
    if (t.type === TokenType.NUMBER) {
      stack.push({
        type: NodeType.CONSTANT,
        value: t.value,
        valueType: "number",
      });
      continue;
    }

    /* ---------- OPERATOR ---------- */
    if (t.type === TokenType.OPERATOR) {
      if (t.value === "u-") {
        if (stack.length < 1) return null;
        const arg = stack.pop();
        stack.push({ type: NodeType.UNARY, op: "-", arg });
        continue;
      }

      if (stack.length < 2) return null;
      const right = stack.pop();
      const left = stack.pop();
      stack.push({ type: NodeType.BINARY, op: t.value, left, right });
    }
  }

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return {
    ast: stack[0],
    dependencies: [...dependencies],
  };
}

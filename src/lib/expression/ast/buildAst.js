import {
  FUNCTION_REGISTRY,
  FUNCTION_ALLOW_BY_MODE,
} from "@lib/analytics/engine/functions/registry";

function containsWindowFunction(node) {
  if (!node) return false;

  if (node.type === "function") {
    const def = FUNCTION_REGISTRY[node.name];
    if (def?.type === "WINDOW") return true;

    return node.args.some(containsWindowFunction);
  }

  if (node.type === "binary") {
    return (
      containsWindowFunction(node.left) || containsWindowFunction(node.right)
    );
  }

  if (node.type === "unary") {
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
    if (t.type === "function") {
      const name = t.value.toUpperCase();

      // Get function definition (execution behavior)
      const fnDef = FUNCTION_REGISTRY[name];
      if (!fnDef) {
        throw new Error(`Unknown function ${name}`);
      }

      // Validate function allowed in this computation mode
      if (type) {
        const allowed = FUNCTION_ALLOW_BY_MODE[type];
        if (!allowed?.has(name)) {
          throw new Error(
            `Function ${name} is not allowed in ${type} computation`,
          );
        }
      }

      const arity = fnDef.arity;

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
      if (fnDef?.type === "WINDOW") {
        for (const arg of args) {
          if (containsWindowFunction(arg)) {
            throw new Error(
              `Nested rolling/window functions are not allowed inside ${name}`,
            );
          }
        }
      }

      stack.push({
        type: "function",
        name,
        args,
      });

      continue;
    }

    /* ---------- IDENTIFIER ---------- */
    if (t.type === "identifier") {
      const id = t.value;
      if (!id) return null;

      stack.push({ type: "key", key: id });
      dependencies.add(id);
      continue;
    }

    /* ---------- STRING ---------- */
    if (t.type === "string") {
      stack.push({ type: "constant", value: t.value });
      continue;
    }

    /* ---------- NUMBER ---------- */
    if (t.type === "number") {
      stack.push({ type: "constant", value: t.value });
      continue;
    }

    /* ---------- OPERATOR ---------- */
    if (t.type === "op") {
      if (t.value === "u-") {
        if (stack.length < 1) return null;
        const arg = stack.pop();
        stack.push({ type: "unary", op: "-", arg });
        continue;
      }

      if (stack.length < 2) return null;
      const right = stack.pop();
      const left = stack.pop();
      stack.push({ type: "binary", op: t.value, left, right });
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

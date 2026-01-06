import { FUNCTION_REGISTRY } from "../functions/registry";

export const FUNCTION_ARITY = Object.fromEntries(
  Object.entries(FUNCTION_REGISTRY).map(([name, def]) => [name, def.arity])
);

export function buildAST(postfix, labelToId) {
  // console.log(postfix);

  const stack = [];
  const dependency = [];

  for (const t of postfix) {
    /* ---------- FUNCTION ---------- */
    if (t.type === "function") {
      const name = t.value.toUpperCase();
      const arity = FUNCTION_ARITY[name];

      if (arity == null) {
        throw new Error(`Unknown function: ${name}`);
      }

      // 🔥 STRICT ARITY CHECK
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

      stack.push({
        type: "function",
        name,
        args,
      });

      continue;
    }

    /* ---------- IDENTIFIER ---------- */
    if (t.type === "identifier") {
      const colId = labelToId[t.value.toLowerCase()];
      if (!colId) return null;

      stack.push({ type: "column", columnId: colId });
      dependency.push(colId);
      continue;
    }

    /* ---------- NUMBER ---------- */
    if (t.type === "number") {
      stack.push({ type: "constant", value: t.value });
      continue;
    }
    console.log(t.type);

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
    dependency,
  };
}

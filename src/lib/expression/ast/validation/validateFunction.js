import { validate } from "./validator";
import { resolveExpected } from "./typeCheckCore";
import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions";

export function validateFunction(node, schemasById) {
  const def = FUNCTION_REGISTRY[node.fn];

  if (!def) {
    throw new Error(`Unknown function ${node.fn}`);
  }

  const args = node.args || [];
  const expectedArgs = def?.args || [];
  const generics = def.generics;

  const typeEnv = {}; // generics: { $T: "number" }

  const actualTypes = args.map((arg) => validate(arg, schemasById));

  expectedArgs.forEach((expected, i) => {
    resolveExpected(expected, actualTypes[i], typeEnv, generics, node.fn, i);
  });

  /* ---------- RETURN TYPE ---------- */

  const ret = def?.returnType;

  if (!ret) return null;

  // generic return
  if (typeof ret === "string" && ret.startsWith("$")) {
    if (!typeEnv[ret]) {
      throw new Error(`Unresolved generic ${ret} in ${node.fn}`);
    }
    return typeEnv[ret];
  }

  return ret;
}

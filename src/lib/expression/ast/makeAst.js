import { buildAST } from "./buildAst";
import { tokenize } from "./tokenize";
import { toPostfix } from "./toPostfix";

export const makeAST = (expr, mode = "GLOBAL") => {
  const ast = buildAST(toPostfix(tokenize(expr)), mode).ast;
  return ast;
};

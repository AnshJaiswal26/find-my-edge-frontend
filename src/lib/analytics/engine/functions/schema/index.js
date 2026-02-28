import { CUMSUM } from "./cumsum";
import { CUMSUM_RESET } from "./cumsum_reset";
import { PREV } from "./prev";
import { SELF } from "./fnSELF";

import { FunctionType } from "../funtionType";
import { ExecutionMode } from "../executionMode";

const SchemaFns = {
  CUMSUM,
  CUMSUM_RESET,
  PREV,
  SELF,
};

export const SchemaFunctions = Object.fromEntries(
  Object.entries(SchemaFns).map(([name, fn]) => [
    name,
    { ...fn, type: FunctionType.PURE, executionMode: ExecutionMode.AST },
  ]),
);

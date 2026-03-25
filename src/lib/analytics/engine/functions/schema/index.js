import { CUMSUM } from "./cumsum";
import { CUMSUM_RESET } from "./cumsum_reset";
import { PREV } from "./prev";
import { SELF } from "./fnSELF";

import { FUNCTION_TYPE } from "../funtionType";
import { EXECUTION_MODE } from "../EXECUTION_MODE";
import { WINDOW_STRATEGY } from "../windowStrategy";

const WINDOW_SCHEMA_FNS = {
  CUMSUM,
  CUMSUM_RESET,
};

const SCHEMA_FNS = {
  PREV,
  SELF,
};

export const SCHEMA_FUNCTIONS = {
  ...Object.fromEntries(
    Object.entries(SCHEMA_FNS).map(([name, fn]) => [
      name,
      { ...fn, type: FUNCTION_TYPE.PURE, executionMode: EXECUTION_MODE.AST },
    ]),
  ),

  ...Object.fromEntries(
    Object.entries(WINDOW_SCHEMA_FNS).map(([name, fn]) => [
      name,
      {
        ...fn,
        type: FUNCTION_TYPE.WINDOW,
        strategy: WINDOW_STRATEGY.CUMULATIVE,
        executionMode: EXECUTION_MODE.AST,
      },
    ]),
  ),
};

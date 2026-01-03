import { fnCUM, fnPREV, fnSELF, fnRESET } from "./cumulative";
import { fnSUM, fnAVG } from "./aggregation";
import { fnIF } from "./logical";

export const FUNCTION_REGISTRY = {
  PREV: fnPREV,
  SELF: fnSELF,
  CUM: fnCUM,
  RESET: fnRESET,
  SUM: fnSUM,
  AVG: fnAVG,
  IF: fnIF,
};

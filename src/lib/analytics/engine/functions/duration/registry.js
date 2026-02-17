import { FUNCTION_TYPE } from "../type";
import { SECONDS, DAYS, HOURS, MINUTES } from "./reducers";

export const DURATION_FUNCTIONS = {
  SECONDS: {
    type: FUNCTION_TYPE.BASE,
    reducer: SECONDS,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: ["number"],
      return: "duration",
    },
    signature: "SECONDS(n)",
    description: "Convert seconds to duration",
  },

  MINUTES: {
    type: FUNCTION_TYPE.BASE,
    reducer: MINUTES,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: ["number"],
      return: "duration",
    },
    signature: "MINUTES(n)",
    description: "Convert minutes to duration",
  },

  HOURS: {
    type: FUNCTION_TYPE.BASE,
    reducer: HOURS,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",
    semantic: {
      args: ["number"],
      return: "duration",
    },
    signature: "HOURS(n)",
    description: "Convert hours to duration",
  },

  DAYS: {
    type: FUNCTION_TYPE.BASE,
    reducer: DAYS,
    arity: 1,
    argTypes: ["number"],
    returnType: "number",

    semantic: {
      args: ["number"],
      return: "duration",
    },
    signature: "DAYS(n)",
    description: "Convert days to duration",
  },
};

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { parseInputValue } from "../../utils";
import { createUISlice } from "./ui.slice";

export const useTradeSetupStore = create(
  immer((set, get) => ({
    tradeSetupsOrder: ["setup-1"],
    tradeSetupsById: {
      "setup-1": {
        id: "setup-1",
        name: "Breakout Reversal",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqBnJX4nYPZ3YfjKSL9dlGsuG3bdrIGJySQQ&s",
        imagePublicId: "xyz",
        fieldOrder: [
          "field-1",
          "field-2",
          "field-3",
          "field-4",
          "field-5",
          "field-6",
        ],
        fieldsById: {
          "field-1": {
            id: "field-1",
            label: "Field 1",
            mappedSchemaId: "pnl",
            condition: "greaterThan",
            expected: 500,
            from: 0,
            to: 0,
            semanticType: "number",
            tag: "GOOD",
          },
          "field-2": {
            id: "field-2",
            label: "Field 2",
            mappedSchemaId: "entryTime",
            condition: "isBetween",
            expected: 0,
            from: parseInputValue("09:30:00", "time"),
            to: parseInputValue("11:00:00", "time"),
            semanticType: "time",
            tag: "GOOD",
          },
          "field-3": {
            id: "field-3",
            label: "Field 3",
            mappedSchemaId: "duration",
            condition: "lessThan",
            expected: 1800,
            from: 0,
            to: 0,
            semanticType: "duration",
            tag: "GOOD",
          },
          "field-4": {
            id: "field-4",
            label: "Field 4",
            mappedSchemaId: "qty",
            condition: "isBetween",
            expected: 0,
            from: 20,
            to: 30,
            semanticType: "number",
            tag: "GOOD",
          },
          "field-5": {
            id: "field-3",
            label: "Field 5",
            mappedSchemaId: "pnl",
            condition: "greaterThan",
            expected: 1200,
            from: 0,
            to: 0,
            semanticType: "number",
            tag: "VERY_GOOD",
          },
          "field-6": {
            id: "field-6",
            label: "Field 6",
            mappedSchemaId: "pnl",
            condition: "greaterThan",
            expected: 2000,
            from: 0,
            to: 0,
            semanticType: "number",
            tag: "EXCELLENT",
          },
        },
      },
    },
    ...createUISlice(set, get),
    isLoading: false,
  })),
);

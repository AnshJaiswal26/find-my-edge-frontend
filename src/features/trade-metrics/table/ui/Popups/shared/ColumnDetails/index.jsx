import {
  ColorRules,
  ExpressionBuilder,
  Input,
  Select,
  SelectOptionsEditor,
} from "@ui";
import { DisplaySection } from "./DisplaySection";
import { Section } from "@layout";

import { useTableStore } from "@table/store/useTableStore";
import { DEFAULT_FORMATS } from "@utils";
import { SCHEMA_TYPES, SCHEMA_TYPES_LABELS } from "@lib/analytics/schema";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";
import { BASE_FUNCTIONS } from "@lib/analytics/engine/functions/base/registry";
import { CONDITION_FUNCTIONS } from "@lib/analytics/engine/functions/condition/registry";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ColumnDetails({
  columns,
  draft,
  onDraftChange,
  activeColumn,
  error,
}) {
  if (!draft) return null;

  const isGrouped = useTableStore((s) => s.groupBy !== null);

  const functions = useMemo(() => {
    const fn = draft.mode === "row" ? BASE_FUNCTIONS : WINDOW_FUNCTIONS;
    return { ...fn, ...CONDITION_FUNCTIONS };
  }, [draft.mode]);

  return (
    <div className="flex-1 w-full space-y-4 overflow-auto">
      <Select
        label={"Column Type"}
        value={draft.type}
        options={SCHEMA_TYPES}
        getLabel={(v) => SCHEMA_TYPES_LABELS[v]}
        onChange={(v) =>
          onDraftChange((p) => ({
            ...p,
            type: v,
            editable: !v.includes("computed"),
            display: { format: DEFAULT_FORMATS[v], decimals: 2 },
          }))
        }
      />

      <Select
        label={"Computation Mode"}
        value={draft.mode}
        options={["row", "cumulative", ...(isGrouped ? ["grouped"] : [])]}
        getLabel={(v) => v.toUpperCase()}
        onChange={(v) => onDraftChange((p) => ({ ...p, mode: v }))}
      />

      {/* Label */}
      <Section title={"Label"}>
        <Input
          vertical
          placeholder="Enter Column Name"
          value={draft.label}
          onChange={(e) => {
            onDraftChange((p) => ({ ...p, label: e.target.value }));
          }}
        />
        {error?.input && (
          <div className="text-sm text-red-500 w-full text-left">
            {error.input}
          </div>
        )}
      </Section>

      {/* Computed */}
      {draft.type.includes("computed") && (
        <ExpressionBuilder
          key={draft.id}
          value={draft.formula}
          schemas={columns}
          functions={functions}
          onCommit={(formula, expression, dependencies) => {
            onDraftChange((p) => ({
              ...p,
              formula,
              expression,
              dependencies,
            }));
          }}
        />
      )}

      {/* Select */}
      {draft.type === "select" && (
        <SelectOptionsEditor
          options={draft?.options || []}
          onChange={(opts) => onDraftChange((p) => ({ ...p, options: opts }))}
        />
      )}

      {/* Display */}
      <DisplaySection
        type={draft.type}
        display={draft.display}
        onChange={onDraftChange}
      />

      {/* Color rules */}
      <ColorRules
        type={draft.type}
        rules={draft.colorRules}
        onChange={onDraftChange}
      />
    </div>
  );
}

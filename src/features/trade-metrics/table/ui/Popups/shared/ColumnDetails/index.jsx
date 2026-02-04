import {
  ColorRules,
  ExpressionBuilder,
  Input,
  Select,
  SelectOptionsEditor,
} from "@ui";
import { DisplaySection } from "./DisplaySection";
import { ErrorText, Section } from "@layout";

import { DEFAULT_FORMATS } from "@utils";
import { SCHEMA_TYPES, SCHEMA_TYPES_LABELS } from "@lib/analytics/schema";
import { useMemo } from "react";

export default function ColumnDetails({
  columnsById,
  draft,
  onDraftChange,
  error,
  builderRef,
}) {
  if (!draft) return null;

  const mode = useMemo(() => {
    return draft.mode === "row" ? "BASE" : "WINDOW";
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
        options={["row", "cumulative", "grouped"]}
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
        {error?.input && <ErrorText text={error.input} />}
      </Section>

      {/* Computed */}
      {draft.type.includes("computed") && (
        <>
          <Section title={"Initial Value"}>
            <Input
              vertical
              type="number"
              placeholder="Enter initital value"
              value={draft.initialValue}
              onChange={(e) => {
                onDraftChange((p) => ({
                  ...p,
                  initialValue: Number(e.target.value),
                }));
              }}
            />
          </Section>
          <ExpressionBuilder
            key={draft.id}
            value={draft.formula}
            schemasById={columnsById}
            mode={mode}
            ref={builderRef}
            onCommit={(formula, expression, dependencies) => {
              onDraftChange((p) => ({
                ...p,
                formula,
                expression,
                dependencies,
              }));
            }}
          />
        </>
      )}

      {/* Select */}
      {draft.type === "select" && (
        <SelectOptionsEditor
          error={error}
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

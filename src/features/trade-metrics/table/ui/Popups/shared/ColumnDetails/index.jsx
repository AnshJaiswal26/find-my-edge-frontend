import { ExpressionBuilder } from "../ExpressionBuilder";
import { ColorRules, Input, Select, SelectOptionsEditor } from "@ui";
import { DisplaySection } from "./DisplaySection";
import { Section } from "@layout";
import { COLUMN_TYPES, COLUMN_TYPES_LABELS } from "@table/model";
import { useTableStore } from "@table/store/useTableStore";
import { DEFAULT_FORMATS } from "@utils";

export default function ColumnDetails({ column, draft, onDraftChange }) {
  if (!column) return null;

  const isGrouped = useTableStore((s) => s.groupBy !== null);

  return (
    <div className="flex-1 w-full space-y-4 overflow-auto">
      <Select
        label={"Column Type"}
        value={draft.type}
        options={COLUMN_TYPES}
        getLabel={(v) => COLUMN_TYPES_LABELS[v]}
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
          onChange={(e) =>
            onDraftChange((p) => ({ ...p, label: e.target.value }))
          }
        />
      </Section>

      {/* Computed */}
      {draft.type.includes("computed") && (
        <ExpressionBuilder
          key={column.id}
          value={draft.formula}
          mode={draft.mode}
          onCommit={(v, exp, dependencies) => {
            onDraftChange((p) => ({
              ...p,
              formula: v,
              expression: exp,
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

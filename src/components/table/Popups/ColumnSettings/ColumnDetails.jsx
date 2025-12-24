import { FormulaInput } from "../MetricBuilder/FormulaInput";
import { Input } from "@ui";
import { SelectOptionsEditor } from "./SelectOptionsEditor";

export function ColumnDetails({
  column,
  draft,
  ast,
  numericColumns,
  onDraftChange,
}) {
  if (!column) return null;

  return (
    <div className="flex-1 p-3 space-y-4">
      {/* Label */}
      <Input
        vertical
        label="Label"
        value={draft.label}
        onChange={(e) => onDraftChange({ ...draft, label: e.target.value })}
      />

      {/* Computed */}
      {column.type === "computed" && (
        <>
          <FormulaInput
            value={draft.formula}
            onChange={(v) => onDraftChange({ ...draft, formula: v })}
            ast={ast}
            numericColumns={numericColumns}
          />

          <div className="text-xs text-(--muted)">
            Depends on: {column.dependsOn?.join(", ") || "—"}
          </div>
        </>
      )}

      {/* Select */}
      {column.type === "select" && (
        <SelectOptionsEditor
          options={draft.options}
          onChange={(opts) => onDraftChange({ ...draft, options: opts })}
        />
      )}
    </div>
  );
}

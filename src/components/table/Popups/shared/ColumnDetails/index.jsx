import { ExpressionBuilder } from "../ExpressionBuilder";
import { Input, SelectOptionsEditor } from "@ui";
import { DisplaySection } from "./DisplaySection";
import { ColorRulesSection } from "./ColorRulesSection";
import { Section } from "@layout";

export default function ColumnDetails({ column, draft, onDraftChange }) {
  if (!column) return null;

  return (
    <div className="flex-1 w-full space-y-4 overflow-auto">
      {/* Label */}
      <Section title={"Label"}>
        <Input
          vertical
          placeholder="Enter Column Name"
          value={draft.label}
          onChange={(e) => onDraftChange({ ...draft, label: e.target.value })}
        />
      </Section>

      {/* Computed */}
      {column.type === "computed" && (
        <>
          <ExpressionBuilder
            value={draft.formula}
            onCommit={(v, exp, dependsOn) => {
              onDraftChange({
                ...draft,
                formula: v,
                expression: exp,
                dependsOn,
              });
            }}
          />
          {column?.dependsOn && column.dependsOn.length !== 0 && (
            <Section title={"Depends on"}>
              {column.dependsOn?.join(", ") || "—"}
            </Section>
          )}
        </>
      )}

      {/* Select */}
      {column.type === "select" && (
        <SelectOptionsEditor
          options={draft.options}
          onChange={(opts) => onDraftChange({ ...draft, options: opts })}
        />
      )}

      {/* Display */}
      <DisplaySection
        type={column.type}
        display={draft.display}
        onChange={onDraftChange}
      />

      {/* Color rules */}
      <ColorRulesSection
        type={column.type}
        rules={draft.colorRules}
        onChange={onDraftChange}
      />
    </div>
  );
}

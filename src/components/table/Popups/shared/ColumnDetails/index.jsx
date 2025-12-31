import { ExpressionBuilder } from "../ExpressionBuilder";
import { Input, Select, SelectOptionsEditor } from "@ui";
import { DisplaySection } from "./DisplaySection";
import { ColorRulesSection } from "./ColorRulesSection";
import { Section } from "@layout";

export default function ColumnDetails({ column, draft, onDraftChange }) {
  if (!column) return null;

  console.log("Col Details:", draft);

  return (
    <div className="flex-1 w-full space-y-4 overflow-auto">
      <Select
        label={"Column Type"}
        value={draft.type}
        options={["computed", "number", "text", "date", "time", "select"]}
        getLabel={(v) => v.toUpperCase()}
        onChange={(v) =>
          onDraftChange((p) => ({
            ...p,
            type: v,
            display: { format: "", decimals: 2, prefix: "", suffix: "" },
          }))
        }
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
      {draft.type === "computed" && (
        <>
          <ExpressionBuilder
            value={draft.formula}
            onCommit={(v, exp, dependsOn) => {
              onDraftChange((p) => ({
                ...p,
                formula: v,
                expression: exp,
                dependsOn,
              }));
            }}
          />
        </>
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
      <ColorRulesSection
        type={draft.type}
        rules={draft.colorRules}
        onChange={onDraftChange}
      />
    </div>
  );
}

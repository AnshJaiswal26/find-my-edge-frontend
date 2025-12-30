import { Section } from "@layout";
import { Select, Input, ColorPicker } from "@ui";
import { filterByType, filterOptions } from "@utils";
import { Trash2 } from "lucide-react";

function updateRule(index, patch, onChange) {
  onChange((p) => {
    const next = [...p.colorRules];
    next[index] = { ...next[index], ...patch };
    return { ...p, colorRules: next };
  });
}

export function ColorRulesSection({ rules, onChange, type }) {
  if (!rules) return null;
  return (
    <Section title="Conditional Colors">
      {rules.map((r, i) => (
        <div
          key={i}
          className={`space-y-2 ${
            i !== 0 ? "pt-3 border-t" : ""
          } border-(--border)`}
        >
          <Select
            value={r.operator}
            options={filterByType[type]}
            getLabel={(v) => filterOptions[v]}
            onChange={(op) => updateRule(i, { operator: op }, onChange)}
          />

          <div className="flex gap-2">
            <Input
              value={r.value}
              placeholder={`Enter Value ${
                r.operator === "isBetween" || r.operator === "isNotBetween"
                  ? "1"
                  : ""
              }`}
              type={type === "date" ? "date" : "number"}
              onChange={(e) =>
                updateRule(i, { value: e.target.value }, onChange)
              }
            />
            <ColorPicker
              reset={false}
              value={r.color}
              onCommit={(c) => updateRule(i, { color: c }, onChange)}
            />
            {(r.operator === "isBetween" || r.operator === "isNotBetween") && (
              <Input
                value={r.value2}
                placeholder="Enter Value 2"
                type="number"
                onChange={(e) =>
                  updateRule(i, { value2: e.target.value }, onChange)
                }
              />
            )}

            <button
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  colorRules: p.colorRules.filter((_, idx) => idx !== i),
                }))
              }
              className="text-(--text) hover:text-(--error)"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <div>
        <button
          className="text-xs text-(--info) hover:underline"
          onClick={() =>
            onChange((p) => ({
              ...p,
              colorRules: [
                ...rules,
                { operator: ">", value: 0, color: "#22c55e" },
              ],
            }))
          }
        >
          + Add rule
        </button>
      </div>
    </Section>
  );
}

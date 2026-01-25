import { Divider, Section } from "@layout";
import { Select, Input, ColorPicker } from "@ui";
import { FILTER_TYPE, FILTER_OPTIONS } from "@utils";
import { Trash2 } from "lucide-react";

function updateRule(index, patch, onChange) {
  onChange((p) => {
    const next = [...p.colorRules];
    next[index] = { ...next[index], ...patch };
    return { ...p, colorRules: next };
  }, patch);
}

export default function ColorRules({
  rules,
  onChange,
  type,
  label = false,
  section = true,
}) {
  if (!rules) return null;
  return (
    <Section
      title="Conditional Colors"
      className={section ? "" : "p-0! border-0!"}
    >
      {rules.map((r, i) => (
        <div key={i} className="space-y-2">
          <Select
            value={r.operator}
            options={FILTER_TYPE[type]}
            getLabel={(v) => FILTER_OPTIONS[v]}
            onChange={(op) => updateRule(i, { operator: op }, onChange)}
          />
          <div className="flex flex-wrap gap-2">
            {i !== 0 && <Divider className="my-3" />}

            <Input
              value={r.value}
              placeholder={`Enter Value ${
                r.operator === "isBetween" || r.operator === "isNotBetween"
                  ? "1"
                  : ""
              }`}
              type={
                type === "select"
                  ? "text"
                  : type.includes("computed")
                    ? "number"
                    : type
              }
              onChange={(e) =>
                updateRule(i, { value: e.target.value }, onChange)
              }
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

            {label && (
              <Input
                vertical
                placeholder={"Enter Label"}
                value={r.label}
                onChange={(e) =>
                  updateRule(i, { label: e.target.value }, onChange)
                }
              />
            )}

            <ColorPicker
              reset={false}
              value={r.color}
              onCommit={(c) => updateRule(i, { color: c }, onChange)}
            />

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
                ...p.colorRules,
                { operator: ">", value: 0, color: "#fff" },
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

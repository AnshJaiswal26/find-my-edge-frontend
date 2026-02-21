import { Section } from "@shared/components/layout";
import {
  Select,
  Input,
  ColorPicker,
  Button,
  RangeInput,
  Divider,
} from "@shared/components/ui";
import { FILTER_TYPE, FILTER_OPTIONS, isBetween } from "@shared/utils";
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
    <Section title="Colors Rules" className={section ? "" : "p-0! border-0!"}>
      {rules.map((r, i) => (
        <div key={i} className="space-y-3">
          {i !== 0 && <Divider className="my-3" />}

          <Select
            label={"Condition"}
            vertical
            value={r.operator}
            options={["always", ...FILTER_TYPE[type]]}
            getLabel={(v) => FILTER_OPTIONS[v]}
            onChange={(op) => updateRule(i, { operator: op }, onChange)}
          />

          {r.operator === "always" ? null : isBetween(r.operator) ? (
            <RangeInput
              type={type}
              value={{ from: r.value, to: r.value2 }}
              onChange={({ from, to }) =>
                updateRule(i, { value: from, value2: to }, onChange)
              }
            />
          ) : (
            <Input
              label={"Value"}
              vertical
              value={r.value}
              type={type}
              normalize
              placeholder={`Enter Value ${isBetween(r.operator) ? "1" : ""}`}
              onChange={(parsed) => updateRule(i, { value: parsed }, onChange)}
            />
          )}

          {label && (
            <Input
              label={"Label"}
              vertical
              placeholder={"Enter Label"}
              value={r.label}
              onChange={(v) => updateRule(i, { label: v }, onChange)}
            />
          )}

          <div className="flex items-center space-x-6">
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
        <Button.Text
          onClick={() =>
            onChange((p) => ({
              ...p,
              colorRules: [
                ...p.colorRules,
                { operator: "none", value: 0, color: "#fff" },
              ],
            }))
          }
        >
          + Add rule
        </Button.Text>
      </div>
    </Section>
  );
}

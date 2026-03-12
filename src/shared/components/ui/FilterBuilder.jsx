import { FILTER_OPTIONS, FILTER_TYPE, isBetween } from "@shared/utils";
import { Button, Input, RangeInput, Select } from "@shared/components/ui";
import { Trash2 } from "lucide-react";
import { SemanticType } from "@lib/analytics/schema";

export default function FilterBuilder({
  filters,
  fieldOptions,
  getFieldType,
  addFilter,
  updateFilter,
  removeFilter,
}) {
  return (
    <>
      {filters.length === 0 && (
        <p className="text-sm text-center rounded border border-(--border) p-20 text-(--text-muted)">
          No filters applied. Add a rule to narrow results.
        </p>
      )}

      {filters.map((f, index) => {
        const type = getFieldType(f.key);

        return (
          <div
            key={f.id ?? index}
            className="relative rounded border border-(--border) bg-(--surface-muted) p-3"
          >
            <div className="text-[11px] uppercase text-(--muted)">
              Rule {index + 1}
            </div>

            <div className="flex flex-col gap-3">
              <Select
                label="Field:"
                options={fieldOptions}
                getLabel={(o) => o.label ?? o.name}
                getKey={(o) => o.field ?? o.id}
                value={f.key}
                onChange={(o) =>
                  updateFilter(index, {
                    key: o.field ?? o.id,
                    operator: "none",
                    value: "",
                    value2: "",
                  })
                }
              />

              {type && (
                <>
                  <Select
                    label="Condition:"
                    options={FILTER_TYPE[type]}
                    getLabel={(o) => FILTER_OPTIONS[o]}
                    value={f.operator}
                    onChange={(o) => updateFilter(index, { operator: o })}
                  />

                  {isBetween(f.operator) ? (
                    <RangeInput
                      type={type}
                      value={{ from: f.from, to: f.to }}
                      onChange={({ from, to }) => {
                        // auto swap if range is reversed
                        if (
                          type !== SemanticType.STRING &&
                          from != null &&
                          to != null &&
                          from > to
                        ) {
                          [from, to] = [to, from];
                        }

                        updateFilter(index, { from, to });
                      }}
                    />
                  ) : (
                    <Input
                      label="Value"
                      vertical
                      normalize
                      placeholder="Enter value"
                      type={type}
                      value={f.value ?? ""}
                      onChange={(parsed) =>
                        updateFilter(index, { value: parsed })
                      }
                    />
                  )}
                </>
              )}

              <Button.Icon onClick={() => removeFilter(index)}>
                <Trash2 size={16} />
              </Button.Icon>
            </div>
          </div>
        );
      })}

      <div>
        <Button.Text onClick={addFilter}>+ Add rule</Button.Text>
      </div>
    </>
  );
}

import { FILTER_OPTIONS, FILTER_TYPE, isBetween } from "@utils";
import { Button, Input, RangeInput, Select } from "@ui";
import { Trash2 } from "lucide-react";

export default function FilterBuilder({
  filters,
  fieldOptions,
  getFieldMeta,
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
        const field = getFieldMeta(f.key);

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
                getKey={(o) => o.key ?? o.id}
                value={f.key}
                onChange={(o) =>
                  updateFilter(index, {
                    key: o.key ?? o.id,
                    operator: "none",
                    value: "",
                    value2: "",
                  })
                }
              />

              {field && (
                <>
                  <Select
                    label="Condition:"
                    options={FILTER_TYPE[field.semanticType]}
                    getLabel={(o) => FILTER_OPTIONS[o]}
                    value={f.operator}
                    onChange={(o) => updateFilter(index, { operator: o })}
                  />

                  {isBetween(f.operator) ? (
                    <RangeInput
                      type={field.type}
                      value={{ from: f.value, to: f.value2 }}
                      onChange={({ from, to }) =>
                        updateFilter(index, { value: from, value2: to })
                      }
                    />
                  ) : (
                    <Input
                      label="Value"
                      vertical
                      normalize
                      placeholder="Enter value"
                      type={field.type}
                      value={f.value}
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

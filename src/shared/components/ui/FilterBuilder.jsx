import { FILTER_OPTIONS, FILTER_TYPE, isBetween } from "@shared/utils";
import { Button, Input, RangeInput, Select } from "@shared/components/ui";
import { Trash2 } from "lucide-react";
import { SEMANTIC_TYPE } from "@lib/analytics/schema";

export default function FilterBuilder({
  filters,
  fieldOptions,
  getType,
  getKey,
  setFilters,
}) {
  const addFilter = () => {
    setFilters((f) => [
      ...f,
      { key: "", operator: "none", value: 0, from: 0, to: 0 },
    ]);
  };

  const updateFilter = (index, patch) => {
    setFilters((f) =>
      f.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const removeFilter = (index) => {
    setFilters((f) => f.filter((_, i) => i !== index));
  };

  return (
    <>
      {filters.length === 0 && (
        <p className="text-sm text-center rounded border border-(--border) p-20 text-(--text-muted)">
          No filters applied. Add a rule to narrow results.
        </p>
      )}

      {filters.map((f, index) => {
        const type = getType(f.key);

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
                getKey={getKey}
                value={f.key}
                onChange={(o) =>
                  updateFilter(index, {
                    key: getKey(o),
                    operator: "none",
                    value: "",
                    from: "",
                    to: "",
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
                          type !== SEMANTIC_TYPE.STRING &&
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

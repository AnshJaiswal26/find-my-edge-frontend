import { Popup } from "@layout";
import { FILTER_OPTIONS } from "@utils";
import { Button, Input, Select } from "@ui";
import { Trash2 } from "lucide-react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { useState } from "react";

export default function FilterPopup({ chartId }) {
  const appliedfilters = useChartStore((s) => s[chartId].filters);
  const [filters, setFilters] = useState([...appliedfilters]);

  const ySeriesConfig = useChartStore((s) => s[chartId].ySeriesConfig);
  const xSeriesConfig = useChartStore((s) => s[chartId].xSeriesConfig);

  const seriesConfig = [...ySeriesConfig, xSeriesConfig];

  const { clearFilters, closePopup, applyFilters } = useChartStore.getState();

  const addFilter = () => {
    setFilters((f) => [
      ...f,
      { key: "", operator: "none", value: "", value2: "" },
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
    <Popup open>
      <Popup.Container className="w-50 max-w-50">
        <Popup.Header title="Filters" onClose={closePopup} />

        <Popup.Body className="px-4 py-3 flex flex-col gap-4 justify-between">
          {filters.length === 0 && (
            <p className="text-sm text-center rounded border border-(--border) p-20 text-(--text-muted)">
              No filters applied. Add a rule to narrow results.
            </p>
          )}

          {filters.map((f, index) => {
            return (
              <div
                key={index}
                className="
                  relative
                  rounded
                  border border-(--border)
                  bg-(--surface-muted)
                  p-3
                "
              >
                {/* Rule label */}
                <div className="text-[11px] uppercase text-(--muted)">
                  Rule {index + 1}
                </div>

                <div className="flex flex-col gap-3">
                  <Select
                    label={"Column Name: "}
                    options={seriesConfig}
                    getLabel={(o) => o.name}
                    getKey={(o) => o.key}
                    value={f.key}
                    onChange={(o) =>
                      updateFilter(index, {
                        key: o.key,
                        operator: "none",
                        value: "",
                        value2: "",
                      })
                    }
                  />

                  <Select
                    label={"Filter: "}
                    options={Object.keys(FILTER_OPTIONS)}
                    getLabel={(o) => FILTER_OPTIONS[o]}
                    value={f.operator}
                    onChange={(o) => updateFilter(index, { operator: o })}
                  />

                  {/* Value(s) */}
                  {f.operator.includes("Between") ? (
                    <div className="col-span-3 flex justify-between">
                      <Input
                        label="From"
                        vertical
                        value={f.value}
                        onChange={(e) =>
                          updateFilter(index, {
                            value: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="To"
                        vertical
                        value={f.value2}
                        onChange={(e) =>
                          updateFilter(index, {
                            value2: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      label="Value"
                      vertical
                      value={f.value}
                      onChange={(e) =>
                        updateFilter(index, { value: e.target.value })
                      }
                    />
                  )}

                  <Button.Icon onClick={() => removeFilter(index)}>
                    <Trash2 size={16} />
                  </Button.Icon>
                </div>
              </div>
            );
          })}

          {/* ADD FILTER */}
          <div>
            <button
              className="text-sm text-(--info) cursor-pointer hover:underline"
              onClick={addFilter}
            >
              + Add rule
            </button>
          </div>
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => clearFilters(chartId)}
          onApply={() => applyFilters(chartId, filters)}
        />
      </Popup.Container>
    </Popup>
  );
}

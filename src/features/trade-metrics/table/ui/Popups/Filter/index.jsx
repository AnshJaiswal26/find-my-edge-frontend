import { Popup } from "@layout";
import { useTableStore } from "../../../store/useTableStore";
import { filterOptions } from "@utils";
import { Button, Input, Select } from "@ui";
import { Trash2 } from "lucide-react";

export const filterOptionsByType = {
  text: [
    "none",
    "textContains",
    "textDoesNotContain",
    "textStartsWith",
    "textEndsWith",
    "textIsExactly",
  ],
  number: [
    "none",
    "greaterThan",
    "greaterThanEqualTo",
    "lessThan",
    "lessThanEqualTo",
    "isEqualTo",
    "isNotEqualTo",
    "isBetween",
    "isNotBetween",
  ],
  computed: [
    "none",
    "greaterThan",
    "greaterThanEqualTo",
    "lessThan",
    "lessThanEqualTo",
    "isEqualTo",
    "isNotEqualTo",
    "isBetween",
    "isNotBetween",
  ],
  date: ["none", "dateIs", "dateBefore", "dateAfter"],
  select: [
    "none",
    "textContains",
    "textDoesNotContain",
    "textStartsWith",
    "textEndsWith",
    "textIsExactly",
  ],
};

export default function FilterPopup() {
  const filters = useTableStore((s) => s.filters);
  const columnsById = useTableStore((s) => s.columnsById);
  const activePopup = useTableStore((s) => s.activePopup);

  if (activePopup !== "filter") return null;

  const {
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    closePopup,
    applyFilters,
  } = useTableStore.getState();

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
            const column = columnsById[f.columnId];
            const ops = filterOptionsByType[column.type];

            return (
              <div
                key={f.id}
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
                    options={Object.values(columnsById)}
                    getLabel={(o) => o.label}
                    getKey={(o) => o.id}
                    value={f.columnId}
                    onChange={(o) =>
                      updateFilter(f.id, {
                        columnId: o.id,
                        operator: "none",
                        value: "",
                        value2: "",
                      })
                    }
                  />

                  <Select
                    label={"Filter: "}
                    options={ops}
                    getLabel={(o) => filterOptions[o]}
                    value={f.operator}
                    onChange={(o) => updateFilter(f.id, { operator: o })}
                  />

                  {/* Value(s) */}
                  {f.operator.includes("Between") ? (
                    <div className="col-span-3 flex justify-between">
                      <Input
                        label="From"
                        vertical
                        value={f.value}
                        onChange={(e) =>
                          updateFilter(f.id, { value: e.target.value })
                        }
                      />
                      <Input
                        label="To"
                        vertical
                        value={f.value2}
                        onChange={(e) =>
                          updateFilter(f.id, { value2: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      label="Value"
                      vertical
                      value={f.value}
                      onChange={(e) =>
                        updateFilter(f.id, { value: e.target.value })
                      }
                    />
                  )}

                  <Button.Icon onClick={() => removeFilter(f.id)}>
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
          onCancel={clearFilters}
          onApply={applyFilters}
        />
      </Popup.Container>
    </Popup>
  );
}

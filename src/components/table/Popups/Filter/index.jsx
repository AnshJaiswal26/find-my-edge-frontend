import { Popup } from "@layout";
import { useTableStore } from "../../store";
import { filterOptions } from "@utils";
import { Button, Input } from "@ui";
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
  select: ["none", "textIsExactly", "textDoesNotContain"],
};

export function FilterPopup() {
  const {
    filters,
    activePopup,
    columnsById,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    closePopup,
    applyFilters,
  } = useTableStore();

  if (activePopup !== "filter") return null;

  return (
    <Popup open>
      <Popup.Container className="w-50 max-w-50">
        <Popup.Header title="Filters" onClose={closePopup} />

        <Popup.Body className="px-4 py-3 space-y-4">
          {/* FILTER RULES */}
          {filters.length === 0 && (
            <p className="text-sm text-(--muted)">
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
                  space-y-2
                "
              >
                {/* Rule label */}
                <div className="text-[11px] uppercase text-(--muted)">
                  Rule {index + 1}
                </div>

                <div className="flex flex-col gap-2">
                  {/* Column */}
                  <select
                    className="input col-span-4 border"
                    value={f.columnId}
                    onChange={(e) =>
                      updateFilter(f.id, {
                        columnId: e.target.value,
                        operator: "none",
                        value: "",
                        value2: "",
                      })
                    }
                  >
                    {Object.values(columnsById).map((c) => (
                      <option
                        className={"bg-(--surface-muted)"}
                        key={c.id}
                        value={c.id}
                      >
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {/* Operator */}
                  <select
                    className="input col-span-4 border"
                    value={f.operator}
                    onChange={(e) =>
                      updateFilter(f.id, { operator: e.target.value })
                    }
                  >
                    {ops.map((op) => (
                      <option
                        className={"bg-(--surface-muted)"}
                        key={op}
                        value={op}
                      >
                        {filterOptions[op]}
                      </option>
                    ))}
                  </select>

                  {/* Value(s) */}
                  {f.operator.includes("Between") ? (
                    <div className="col-span-3 flex gap-1">
                      <input
                        className="input border"
                        placeholder="From"
                        value={f.value}
                        onChange={(e) =>
                          updateFilter(f.id, { value: e.target.value })
                        }
                      />
                      <input
                        className="input"
                        placeholder="To"
                        value={f.value2}
                        onChange={(e) =>
                          updateFilter(f.id, { value2: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <Input className="flex-row justify-between gap-3">
                      <Input.Label>Value:</Input.Label>
                      <Input.Field
                        className="max-w-full"
                        size="md"
                        value={f.value}
                        onChange={(e) =>
                          updateFilter(f.id, { value: e.target.value })
                        }
                      />
                    </Input>
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
            <Button text={"+ Add filter rule"} onClick={addFilter} />
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

import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { Input, Select } from "@ui";
import { filterByType, filterOptions } from "@utils";
import { useState } from "react";

export default function GroupByPopup() {
  const columnsById = useTableStore((s) => s.columnsById);
  const groupBy = useTableStore((s) => s.groupBy);

  const { setGroupBy, clearGroupBy, closePopup } = useTableStore.getState();

  const [draft, setDraft] = useState(
    groupBy != null
      ? groupBy
      : {
          key: null,
          type: null,
          mode: "value",
          operation: "none",
          group1Name: "",
          group2Name: "",
          value: "",
          valueTo: "",
        }
  );

  const column = columnsById[draft.key];
  const operations = filterByType[column?.type] ?? ["none"];

  return (
    <Popup open>
      <Popup.Container className="h-100!">
        <Popup.Header title="Group By" onClose={closePopup} />

        <Popup.Body className="px-4 py-4 flex flex-col gap-4">
          {/* Column */}
          <Select
            label="Column"
            options={Object.values(columnsById)}
            getLabel={(o) => o.label}
            getKey={(o) => o.id}
            value={draft.key}
            onChange={(o) =>
              setDraft({
                key: o.id,
                type: o.type,
                mode: "value",
                operation: "none",
                value: "",
                valueTo: "",
              })
            }
          />

          {/* Group mode */}
          {draft.key && (
            <Select
              label="Group mode"
              options={["value", "condition"]}
              getLabel={(o) => (o === "value" ? "By value" : "By condition")}
              value={draft.mode}
              onChange={(mode) => setDraft((p) => ({ ...p, mode }))}
            />
          )}

          {/* Condition controls */}
          {draft.mode === "condition" && (
            <>
              <Select
                label="Condition"
                options={operations}
                getLabel={(o) => filterOptions[o]}
                value={draft.operation}
                onChange={(operation) => setDraft((p) => ({ ...p, operation }))}
              />

              {/* Value input */}
              {draft.operation !== "none" && (
                <>
                  <Input
                    type="number"
                    label={
                      draft.operation === "isBetween" ||
                      draft.operation === "isNotBetween"
                        ? "From"
                        : "Value"
                    }
                    value={draft.value}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        value: e.target.value,
                      }))
                    }
                  />

                  {(draft.operation === "isBetween" ||
                    draft.operation === "isNotBetween") && (
                    <Input
                      type="number"
                      label="To"
                      value={draft.valueTo}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          valueTo: e.target.value,
                        }))
                      }
                    />
                  )}
                </>
              )}

              <Input
                label={"Group-1 Name"}
                value={draft.group1Name}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    group1Name: e.target.value,
                  }))
                }
              />

              <Input
                label={"Group-2 Name"}
                value={draft.group2Name}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    group2Name: e.target.value,
                  }))
                }
              />
            </>
          )}
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={clearGroupBy}
          onApply={() => {
            if (!draft.key) return;
            setGroupBy(draft);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

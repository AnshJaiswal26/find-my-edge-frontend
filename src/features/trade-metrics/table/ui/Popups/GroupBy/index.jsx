import { useTableStore } from "@features/trade-metrics/table/store/useTableStore";
import { Popup } from "@layout";
import { Input, Select } from "@ui";
import { filterByType, filterOptions } from "@utils";
import { useState } from "react";

export default function GroupBy() {
  const { activePopup, columnsById } = useTableStore();
  const { setGroupBy, setConditionGroupBy, clearGroupBy, closePopup } =
    useTableStore.getState();

  const [draft, setDraft] = useState({
    key: null,
    type: null,
    mode: "value",
    operation: "none",
    value: "",
    valueTo: "",
  });

  if (activePopup !== "group") return null;

  const column = columnsById[draft.key];
  const operations = filterByType[column?.type] ?? ["none"];

  return (
    <Popup open>
      <Popup.Container className="w-100! h-90! max-w-55">
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
                    label="Value"
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
            </>
          )}
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => {
            clearGroupBy();
            closePopup();
          }}
          onApply={() => {
            if (!draft.key) return;

            if (draft.mode === "value") {
              setGroupBy({
                key: draft.key,
                type: draft.type,
              });
            } else {
              setConditionGroupBy({
                key: draft.key,
                type: draft.type,
                operation: draft.operation,
                value: draft.value,
                valueTo: draft.valueTo,
              });
            }

            closePopup();
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

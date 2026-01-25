import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { Input, Select, RangeInput } from "@ui";
import { FILTER_TYPE, FILTER_OPTIONS } from "@utils";
import { useState } from "react";

/* =========================================================
 * Grouping schema
 * ========================================================= */
export const GROUPING_SCHEMA = {
  number: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["range"],
    input: "number",
    operators: FILTER_TYPE.number,
  },

  "number computed": {
    kinds: ["value", "bucket", "condition"],
    buckets: ["range"],
    input: "number",
    operators: FILTER_TYPE.number,
  },

  text: {
    kinds: ["value", "condition"],
    input: "text",
    operators: FILTER_TYPE.text,
  },

  select: {
    kinds: ["value", "condition"],
    input: "select",
    operators: FILTER_TYPE.select,
  },

  date: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["day", "month", "year"],
    input: "date",
    operators: FILTER_TYPE.date,
  },

  "date computed": {
    kinds: ["value", "bucket", "condition"],
    buckets: ["day", "month", "year"],
    input: "date",
    operators: FILTER_TYPE.date,
  },

  time: {
    kinds: ["value", "bucket", "condition"],
    buckets: ["hour", "range"],
    input: "time",
    operators: FILTER_TYPE.time,
  },

  "time computed": {
    kinds: ["value", "bucket", "condition"],
    buckets: ["hour", "range"],
    input: "time computed",
    operators: FILTER_TYPE["time computed"],
  },
};

const isBetween = (op) => op?.includes("Between");

export default function GroupByPopup() {
  const columnsById = useTableStore((s) => s.columnsById);
  const groupBy = useTableStore((s) => s.groupBy);
  const { setGroupBy, clearGroupBy, closePopup } = useTableStore.getState();

  const [draft, setDraft] = useState(groupBy ?? {});

  const column = draft.columnId ? columnsById[draft.columnId] : null;

  const schema = column ? GROUPING_SCHEMA[column.type] : null;

  const onColumnChange = (col) => {
    setDraft({
      columnId: col.id,
      columnType: col.type,
      kind: GROUPING_SCHEMA[col.type].kinds[0],
    });
  };

  return (
    <Popup open>
      <Popup.Container>
        <Popup.Header title="Group By" onClose={closePopup} />

        <Popup.Body className="flex flex-col gap-4 p-3!">
          {/* COLUMN */}
          <Select
            label="Column"
            options={Object.values(columnsById)}
            getLabel={(c) => c.label}
            getKey={(c) => c.id}
            value={draft.columnId}
            onChange={onColumnChange}
          />

          {/* KIND */}
          {schema && (
            <Select
              label="Grouping Type"
              options={schema.kinds}
              value={draft.kind}
              onChange={(kind) =>
                setDraft({
                  columnId: draft.columnId,
                  columnType: draft.columnType,
                  kind,
                })
              }
            />
          )}

          {/* VALUE */}
          {draft.kind === "value" && (
            <div className="text-xs text-(--text-muted) text-muted">
              Groups by exact value
            </div>
          )}

          {/* BUCKET */}
          {draft.kind === "bucket" && schema?.buckets && (
            <>
              <Select
                label="Bucket"
                options={schema.buckets}
                value={draft.bucket}
                onChange={(bucket) =>
                  setDraft((p) => ({
                    ...p,
                    bucket,
                    range: undefined,
                  }))
                }
              />

              {/* RANGE BUCKET → N GROUPS */}
              {draft.bucket === "range" && (
                <RangeInput
                  valueType={schema.input}
                  showStep
                  stepUnit={schema.input === "time" ? "minutes" : "raw"}
                  value={draft.range}
                  onChange={(range) => setDraft((p) => ({ ...p, range }))}
                />
              )}
            </>
          )}

          {/* CONDITION */}
          {draft.kind === "condition" && schema && (
            <>
              <Select
                label="Condition"
                options={schema.operators}
                getLabel={(o) => FILTER_OPTIONS[o]}
                value={draft.operator}
                onChange={(operator) =>
                  setDraft((p) => ({
                    ...p,
                    operator,
                    value: null,
                    valueTo: null,
                  }))
                }
              />

              {!isBetween(draft.operator) && (
                <Input
                  label="Value"
                  type={schema.input}
                  normalize
                  value={draft.value ?? ""}
                  step={1}
                  onChange={(e, parsed) => {
                    console.log(parsed);
                    setDraft((p) => ({
                      ...p,
                      value: parsed,
                    }));
                  }}
                />
              )}

              {isBetween(draft.operator) && (
                <RangeInput
                  valueType={schema.input}
                  value={{
                    from: draft.value,
                    to: draft.valueTo,
                  }}
                  onChange={({ from, to }) =>
                    setDraft((p) => ({
                      ...p,
                      value: from,
                      valueTo: to,
                    }))
                  }
                />
              )}

              <Input
                label="Match Group Name"
                value={draft.labels?.match ?? ""}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    labels: {
                      ...p.labels,
                      match: e.target.value,
                    },
                  }))
                }
              />

              <Input
                label="Non-Match Group Name"
                value={draft.labels?.nonMatch ?? ""}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    labels: {
                      ...p.labels,
                      nonMatch: e.target.value,
                    },
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
            if (!draft.columnId || !draft.kind) return;
            setGroupBy(draft);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

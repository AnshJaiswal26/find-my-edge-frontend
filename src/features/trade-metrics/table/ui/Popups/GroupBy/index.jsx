import { useState } from "react";
import { Popup } from "@layout";
import { Input, Select, RangeInput } from "@ui";
import { FILTER_OPTIONS, isBetween } from "@utils";
import { GROUPING_OPTIONS, GROUPING_SCHEMA } from "@lib/analytics/config";
import { useTableStore } from "@table/store/useTableStore";
import { RangeBucket } from "./RangeBucket";

export default function GroupByPopup() {
  const columnsById = useTableStore((s) => s.columnsById);
  const groupBy = useTableStore((s) => s.groupBy);
  const { setGroupBy, clearGroupBy, closePopup } = useTableStore.getState();

  const [draft, setDraft] = useState(groupBy ?? {});

  const column = draft.key ? columnsById[draft.key] : null;

  const schema = column ? GROUPING_SCHEMA[column.type] : null;

  const onColumnChange = (col) => {
    setDraft({
      key: col.id,
      schemaType: col.type,
      kind: GROUPING_SCHEMA[col.type].kinds[0],
      ranges: [],
    });
  };

  return (
    <Popup open>
      <Popup.Container>
        <Popup.Header title="Group By" onClose={closePopup} />

        <Popup.Body className="flex flex-col gap-4 p-5!">
          {/* COLUMN */}
          <Select
            label="Column"
            options={Object.values(columnsById)}
            getLabel={(c) => c.label}
            getKey={(c) => c.id}
            value={draft.key}
            onChange={onColumnChange}
          />

          {/* KIND */}
          {schema && (
            <Select
              label="Grouping Type"
              options={schema.kinds}
              value={draft.kind}
              getLabel={(v) => GROUPING_OPTIONS[v]}
              onChange={(kind) =>
                setDraft((p) => ({
                  ...p,
                  kind,
                }))
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
                getLabel={(v) => GROUPING_OPTIONS[v]}
                onChange={(bucket) =>
                  setDraft((p) => ({
                    ...p,
                    bucket,
                    range: undefined,
                  }))
                }
              />

              {/* RANGE BUCKET → N GROUPS */}
              <RangeBucket draft={draft} setDraft={setDraft} schema={schema} />
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

              {!isBetween(draft.operator) ? (
                <Input
                  label="Value"
                  type={schema.input}
                  normalize
                  value={draft.value ?? ""}
                  onChange={(e, parsed) => {
                    console.log(parsed);
                    setDraft((p) => ({
                      ...p,
                      value: parsed,
                    }));
                  }}
                />
              ) : (
                <RangeInput
                  type={schema.input}
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
                placeholder="Group 1 Name"
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
                placeholder="Group 2 Name"
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
            if (!draft.key || !draft.kind) return;
            setGroupBy(draft);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

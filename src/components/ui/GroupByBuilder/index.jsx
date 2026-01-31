import { Select, Input, RangeInput } from "@ui";
import { FILTER_OPTIONS, isBetween } from "@utils";
import { GROUPING_OPTIONS, GROUPING_SCHEMA } from "@lib/analytics/config";
import { RangeBucket } from "./RangeBucket";

export default function GroupByBuilder({ schemasById, groupBy, onChange }) {
  const draft = groupBy ?? {};

  const field = draft.key ? schemasById[draft.key] : null;
  const schema = field ? GROUPING_SCHEMA[field.type] : null;

  const update = (patch) => onChange?.({ ...draft, ...patch });

  const onFieldChange = (f) => {
    update({
      key: f.id,
      schemaType: f.type,
      kind: GROUPING_SCHEMA[f.type].kinds[0],
      ranges: [],
      bucket: undefined,
      operator: undefined,
      value: undefined,
      valueTo: undefined,
      labels: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* FIELD */}
      <Select
        label="Field"
        options={Object.values(schemasById)}
        getLabel={(f) => f.label}
        getKey={(f) => f.id}
        value={draft.key}
        onChange={onFieldChange}
      />

      {/* KIND */}
      {schema && (
        <Select
          label="Grouping Type"
          options={schema.kinds}
          value={draft.kind}
          getLabel={(v) => GROUPING_OPTIONS[v]}
          onChange={(kind) => update({ kind })}
        />
      )}

      {/* VALUE */}
      {draft.kind === "value" && (
        <div className="text-xs text-(--text-muted)">Groups by exact value</div>
      )}

      {/* BUCKET */}
      {draft.kind === "bucket" && schema?.buckets && (
        <>
          <Select
            label="Bucket"
            options={schema.buckets}
            value={draft.bucket}
            getLabel={(v) => GROUPING_OPTIONS[v]}
            onChange={(bucket) => update({ bucket, ranges: [] })}
          />

          <RangeBucket draft={draft} setDraft={onChange} schema={schema} />
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
              update({ operator, value: null, valueTo: null })
            }
          />

          {!isBetween(draft.operator) ? (
            <Input
              label="Value"
              type={schema.input}
              normalize
              value={draft.value ?? ""}
              onChange={(e, parsed) => update({ value: parsed })}
            />
          ) : (
            <RangeInput
              type={schema.input}
              value={{
                from: draft.value,
                to: draft.valueTo,
              }}
              onChange={({ from, to }) => update({ value: from, valueTo: to })}
            />
          )}

          <Input
            label="Match Group Name"
            placeholder="Group 1 Name"
            value={draft.labels?.match ?? ""}
            onChange={(e) =>
              update({
                labels: { ...draft.labels, match: e.target.value },
              })
            }
          />

          <Input
            label="Non-Match Group Name"
            placeholder="Group 2 Name"
            value={draft.labels?.nonMatch ?? ""}
            onChange={(e) =>
              update({
                labels: { ...draft.labels, nonMatch: e.target.value },
              })
            }
          />
        </>
      )}
    </div>
  );
}

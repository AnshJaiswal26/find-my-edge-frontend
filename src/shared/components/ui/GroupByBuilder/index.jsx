import { Input, RangeInput, Select } from "@shared/components/ui";
import { FILTER_OPTIONS, isBetween } from "@shared/utils";
import { GROUPING_OPTIONS, GROUPING_SCHEMA } from "@lib/analytics/config";
import { RangeBucket } from "./RangeBucket";

export default function GroupByBuilder({
  schemasOrder,
  schemasById,
  groupBy,
  onChange,
}) {
  const draft = groupBy ?? {};

  const field = draft.field ? schemasById[draft.field] : null;
  const schema = field ? GROUPING_SCHEMA[field.semanticType] : null;

  const update = (patch) => onChange?.({ ...draft, ...patch });

  const onFieldChange = (f) => {
    const schema = schemasOrder ? schemasById[f] : f;
    update({
      field: schema.id,
      schemaType: schema.semanticType,
      kind: GROUPING_SCHEMA[schema.semanticType].kinds[0],
      ranges: [],
      bucket: null,
      operator: null,
      value: null,
      from: null,
      to: null,
      labels: null,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* FIELD */}
      <Select
        label="Field"
        options={schemasOrder ? schemasOrder : Object.values(schemasById)}
        getLabel={(f) => (schemasOrder ? schemasById[f].label : f.label)}
        getKey={(f) => (schemasOrder ? schemasById[f].id : f.id)}
        value={draft.field}
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
              value={draft.value ?? ""}
              onCommit={(v) => update({ value: v })}
            />
          ) : (
            <RangeInput
              type={schema.input}
              value={{
                from: draft.from,
                to: draft.to,
              }}
              onChange={({ from, to }) => update({ from, to })}
            />
          )}

          <Input
            label="Match Group Name"
            placeholder="Group 1 Name"
            value={draft.labels?.match ?? ""}
            onCommit={(v) =>
              update({
                labels: { ...draft.labels, match: v },
              })
            }
          />

          <Input
            label="Non-Match Group Name"
            placeholder="Group 2 Name"
            value={draft.labels?.nonMatch ?? ""}
            onCommit={(v) =>
              update({
                labels: { ...draft.labels, nonMatch: v },
              })
            }
          />
        </>
      )}
    </div>
  );
}

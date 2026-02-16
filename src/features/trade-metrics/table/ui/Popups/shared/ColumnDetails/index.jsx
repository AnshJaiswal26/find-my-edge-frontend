import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ColorRules,
  ExpressionBuilder,
  Input,
  Select,
  SelectOptionsEditor,
} from "@ui";
import { DisplaySection } from "./DisplaySection";
import { ErrorText, Section } from "@layout";

import { DEFAULT_FORMATS } from "@utils";
import {
  BASE_TYPES,
  SCHEMA_SOURCE,
  SCHEMA_TYPES_GROUP,
} from "@lib/analytics/schema";

export default function ColumnDetails({
  columnsById,
  draft,
  onDraftChange,
  error,
  builderRef,
}) {
  if (!draft) return null;

  const [isComputed, setIsComputed] = useState(
    draft.source === SCHEMA_SOURCE.COMPUTED,
  );

  const mode = useMemo(() => {
    return draft.mode === "row" ? "BASE" : "WINDOW";
  }, [draft.mode]);

  useEffect(() => {
    setIsComputed(draft.source === SCHEMA_SOURCE.COMPUTED);
  }, [draft.source]);

  console.log(draft);

  return (
    <div className="flex-1 w-full space-y-4 overflow-auto">
      {/* ✅ TYPE (only base types) */}
      {!isComputed && (
        <Select
          label={"Column Type"}
          value={draft.type}
          options={BASE_TYPES}
          getLabel={(v) => v.toUpperCase()}
          onChange={(v) =>
            onDraftChange((p) => ({
              ...p,
              type: v,
              semanticType: SCHEMA_TYPES_GROUP[v],
              editable: true,
              display: { format: DEFAULT_FORMATS[v], decimals: 2 },
            }))
          }
        />
      )}

      {/* 🔥 COMPUTED TOGGLE */}
      <Button.Toggle
        label="Derived"
        value={isComputed}
        onChange={(val) => {
          setIsComputed(val);

          if (!val) {
            // reset computed fields
            onDraftChange((p) => ({
              ...p,
              ast: null,
              formula: "",
              dependencies: [],
            }));
          } else {
            onDraftChange((p) => ({
              ...p,
              source: SCHEMA_SOURCE.COMPUTED,
            }));
          }
        }}
      />

      {/* MODE */}
      <Select
        label={"Computation Mode"}
        value={draft.mode}
        options={["row", "cumulative", "grouped"]}
        getLabel={(v) => v.toUpperCase()}
        onChange={(v) => onDraftChange((p) => ({ ...p, mode: v }))}
      />

      {/* LABEL */}
      <Section title={"Label"}>
        <Input
          vertical
          placeholder="Enter Column Name"
          value={draft.label}
          onChange={(e) => {
            onDraftChange((p) => ({ ...p, label: e.target.value }));
          }}
        />
        {error?.input && <ErrorText text={error.input} />}
      </Section>

      {/* 🔥 EXPRESSION BUILDER */}
      {isComputed && (
        <>
          <Section title={"Initial Value"}>
            <Input
              vertical
              type="number"
              placeholder="Enter initial value"
              value={draft.initialValue}
              onChange={(e) => {
                onDraftChange((p) => ({
                  ...p,
                  initialValue: Number(e.target.value),
                }));
              }}
            />
          </Section>

          <ExpressionBuilder
            key={draft.id}
            value={draft.formula}
            schemasById={columnsById}
            mode={mode}
            ref={builderRef}
            onCommit={(formula, ast, dependencies, semanticType) => {
              onDraftChange((p) => ({
                ...p,
                formula,
                ast,
                dependencies,
                semanticType,
                type: `${semanticType} computed`, // 🔥 auto
                editable: false,
              }));
            }}
          />
        </>
      )}

      {/* SELECT OPTIONS */}
      {!isComputed && draft.type === "select" && (
        <SelectOptionsEditor
          error={error}
          options={draft?.options || []}
          onChange={(opts) => onDraftChange((p) => ({ ...p, options: opts }))}
        />
      )}

      {/* DISPLAY */}
      <DisplaySection
        type={draft.semanticType}
        display={draft.display}
        onChange={onDraftChange}
      />

      {/* COLOR RULES */}
      <ColorRules
        type={draft.semanticType || draft.type}
        rules={draft.colorRules}
        onChange={onDraftChange}
      />
    </div>
  );
}

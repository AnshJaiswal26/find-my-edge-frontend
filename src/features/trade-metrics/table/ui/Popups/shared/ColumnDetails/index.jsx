import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ColorRules,
  ExpressionBuilder,
  Input,
  Select,
  SelectOptionsEditor,
  ErrorText,
} from "@shared/components/ui";
import { DisplaySection } from "./DisplaySection";
import { Section } from "@shared/components/layout";

import { DEFAULT_FORMATS } from "@shared/utils";
import {
  BASE_TYPES,
  SchemaComputeMode,
  SchemaSource,
  SchemaType,
  SchemaTypeGroup,
  SemanticType,
} from "@lib/analytics/schema";
import { COMPUTATION_MODE } from "@lib/analytics/engine/execute";

export default function ColumnDetails({
  columnsById,
  draft,
  onDraftChange,
  error,
  builderRef,
  settings = false,
}) {
  if (!draft) return null;

  const [isComputed, setIsComputed] = useState(
    draft.source === SchemaSource.COMPUTED,
  );
  const mode = useMemo(() => {
    return draft.mode === SchemaComputeMode.ROW
      ? COMPUTATION_MODE.BASE
      : COMPUTATION_MODE.WINDOW;
  }, [draft.mode]);

  useEffect(() => {
    setIsComputed(draft.source === SchemaSource.COMPUTED);
  }, [draft.source]);

  return (
    <div className="flex-1 w-full space-y-4 overflow-auto">
      {/* ✅ TYPE (only base types) */}
      {!isComputed && draft?.source !== SchemaSource.SYSTEM && (
        <Select
          label={"Column Type"}
          value={draft.type}
          options={BASE_TYPES}
          getLabel={(v) => v.toUpperCase()}
          onChange={(v) =>
            onDraftChange((p) => ({
              ...p,
              type: v,
              semanticType: SchemaTypeGroup[v],
              editable: true,
              display: { format: DEFAULT_FORMATS[v], decimals: 2 },
            }))
          }
        />
      )}

      {/*  COMPUTED TOGGLE */}
      {draft?.source !== SchemaSource.SYSTEM && (
        <Button.Toggle
          label="Derived"
          value={isComputed}
          onChange={(val) => {
            setIsComputed(val);
            onDraftChange((p) => ({
              ...p,
              ...(!val && { ast: null, formula: "", dependencies: [] }),
              source: val ? SchemaSource.COMPUTED : SchemaSource.USER,
            }));
          }}
        />
      )}

      {/* MODE */}
      {draft?.source !== SchemaSource.SYSTEM && (
        <Select
          label={"Computation Mode"}
          value={draft.mode}
          options={["row", "cumulative"]}
          getLabel={(v) => v.toUpperCase()}
          onChange={(v) => onDraftChange((p) => ({ ...p, mode: v }))}
        />
      )}

      {/* LABEL */}
      <Section title={"Label"}>
        <Input
          vertical
          placeholder="Enter Column Name"
          value={draft.label}
          onChange={(v) => {
            onDraftChange((p) => ({ ...p, label: v }));
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
              onChange={(v) => {
                onDraftChange((p) => ({
                  ...p,
                  initialValue: Number(v),
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
                type:
                  semanticType === SemanticType.STRING
                    ? SchemaType.TEXT
                    : semanticType,
                editable: false,
              }));
            }}
          />
        </>
      )}

      {/* SELECT OPTIONS */}
      {!isComputed && draft.type === SchemaType.SELECT && (
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

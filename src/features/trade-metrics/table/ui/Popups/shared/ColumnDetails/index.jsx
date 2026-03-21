import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ColorRules,
  ErrorText,
  ExpressionBuilder,
  Input,
  Select,
  SelectOptionsEditor,
} from "@shared/components/ui";
import { DisplaySection } from "./DisplaySection";
import { Section } from "@shared/components/layout";

import { DEFAULT_FORMATS } from "@shared/utils";
import {
  BASE_TYPES,
  SchemaComputeMode,
  SchemaRole,
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
      {!isComputed &&
        draft?.role !== SchemaRole.SYSTEM_REQUIRED &&
        draft?.role !== SchemaRole.SYSTEM_OPTIONAL && (
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

      {/* MODE */}
      {draft?.role !== SchemaRole.SYSTEM_REQUIRED &&
        draft?.role !== SchemaRole.SYSTEM_OPTIONAL && (
          <Select
            label={"Computation Mode"}
            value={draft.mode}
            options={["row", "cumulative"]}
            getLabel={(v) => v.toUpperCase()}
            onChange={(v) => onDraftChange((p) => ({ ...p, mode: v }))}
          />
        )}

      {/*  COMPUTED TOGGLE */}
      {draft?.role !== SchemaRole.SYSTEM_REQUIRED &&
        draft?.role !== SchemaRole.SYSTEM_OPTIONAL && (
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

      {settings && (
        <Button.Toggle
          label="Hidden"
          value={draft.hidden}
          onChange={(val) => {
            onDraftChange((p) => ({
              ...p,
              hidden: val,
            }));
          }}
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

      {/* EXPRESSION BUILDER */}
      {isComputed &&
        draft?.role !== SchemaRole.SYSTEM_REQUIRED &&
        draft?.role !== SchemaRole.SYSTEM_OPTIONAL && (
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
              onCommit={({
                labelFormula,
                idFormula,
                ast,
                dependencies,
                semanticType,
              }) => {
                onDraftChange((p) => ({
                  ...p,
                  formula: labelFormula, // UI expression
                  idFormula, // ENGINE expression
                  ast,
                  dependencies,
                  semanticType,
                  type:
                    semanticType === SemanticType.STRING
                      ? SchemaType.TEXT
                      : semanticType,
                }));
              }}
            />
          </>
        )}

      {/* SELECT OPTIONS */}
      {!isComputed &&
        draft?.role !== SchemaRole.SYSTEM_REQUIRED &&
        draft?.role !== SchemaRole.SYSTEM_OPTIONAL &&
        draft.type === SchemaType.SELECT && (
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

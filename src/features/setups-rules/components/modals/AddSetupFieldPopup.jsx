import { Popup, Section } from "@shared/components/layout";
import { useTradeSetupStore, useTradeStore } from "@shared/stores";
import { useMemo } from "react";
import { ErrorText, Input, RangeInput, Select } from "@shared/components/ui";
import {
  FILTER_OPTIONS,
  FILTER_TYPE,
  isBetween,
  requiredIf,
} from "@shared/utils";
import { TagSelector } from "../ui";
import { useFormValidator } from "@shared/hooks";

export function AddSetupFieldPopup({ setupId }) {
  const closePopup = useTradeSetupStore((s) => s.closePopup);
  const addSetupField = useTradeSetupStore((s) => s.addSetupField);
  const isSubmitting = useTradeSetupStore((s) => s.isSubmitting);

  const schemasOrder = useTradeStore((s) => s.schemasOrder);
  const schemasById = useTradeStore((s) => s.schemasById);

  const schemas = useMemo(
    () =>
      schemasOrder.map((id) => schemasById[id]).filter((s) => s.id !== "setup"),
    [schemasById, schemasOrder],
  );

  const {
    values: draft,
    errors,
    setField,
    validate,
    register,
  } = useFormValidator({
    initialValues: {
      mappedSchemaId: "date",
      condition: "greaterThan",
      expected: "",
      from: "",
      to: "",
      semanticType: "date",
      tag: "EXCELLENT",
    },

    rules: {
      expected: [
        requiredIf(
          (f) => !isBetween(f.condition),
          "Expected value is required",
        ),
      ],

      from: [requiredIf((f) => isBetween(f.condition), "From is required")],

      to: [requiredIf((f) => isBetween(f.condition), "To is required")],
    },
  });

  return (
    <Popup.Container>
      <Popup.Header title={"Add Field"} onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-5">
        <Section title={"Field"}>
          <Select
            options={schemas}
            getLabel={(s) => s.label}
            getKey={(s) => s.id}
            value={draft.mappedSchemaId}
            classNames={{ button: "!min-w-full" }}
            onChange={(s) => {
              setField("mappedSchemaId", s.id);
              setField("semanticType", s.semanticType);
              setField("condition", FILTER_TYPE[s.semanticType][0]);
            }}
          />
        </Section>

        <Section title={"Rule"}>
          <Select
            options={FILTER_TYPE[draft.semanticType]}
            getLabel={(l) => FILTER_OPTIONS[l]}
            classNames={{ button: "!min-w-full" }}
            value={draft.condition}
            onChange={(v) => setField("condition", v)}
          />
        </Section>

        <Section title={"Expected Value"}>
          {isBetween(draft.condition) ? (
            <RangeInput
              type={draft.semanticType}
              value={{ from: draft.from, to: draft.to }}
              onChange={({ from, to }) => {
                setField("from", from);
                setField("to", to);
              }}
              refFrom={register("from")}
              refTo={register("to")}
            />
          ) : (
            <Input
              ref={register("expected")}
              vertical={true}
              placeholder={"Enter Value"}
              type={draft.semanticType}
              value={draft.expected}
              classNames={{ input: "!min-w-full" }}
              onChange={(v) => setField("expected", v)}
            />
          )}

          {(errors.expected || errors.from || errors.to) && (
            <ErrorText text={errors.expected || errors.from || errors.to} />
          )}
        </Section>

        <Section title={"Tag"}>
          <TagSelector
            value={draft.tag}
            onChange={(tag) => setField("tag", tag)}
          />
        </Section>
      </Popup.Body>

      <Popup.Footer
        text={["Cancel", "Add"]}
        loading={{ apply: isSubmitting }}
        disableApply={isSubmitting}
        disableCancel={isSubmitting}
        onApply={() => {
          if (validate()) {
            addSetupField(setupId, draft);
          }
        }}
        onCancel={closePopup}
      />
    </Popup.Container>
  );
}

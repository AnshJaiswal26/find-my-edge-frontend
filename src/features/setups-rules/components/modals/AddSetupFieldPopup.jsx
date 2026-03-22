import { Popup, Section } from "@shared/components/layout";
import { useTradeSetupStore, useTradeStore } from "@shared/stores";
import { useMemo, useState } from "react";
import { Input, RangeInput, Select } from "@shared/components/ui";
import { FILTER_OPTIONS, FILTER_TYPE, isBetween } from "@shared/utils";
import { TagSelector } from "../ui";

export function AddSetupFieldPopup({ setupId }) {
  const closePopup = useTradeSetupStore((s) => s.closePopup);
  const schemasOrder = useTradeStore((s) => s.schemasOrder);
  const schemasById = useTradeStore((s) => s.schemasById);

  const schemas = useMemo(
    () =>
      schemasOrder.map((id) => schemasById[id]).filter((s) => s.id !== "setup"),
    [schemasById, schemasOrder],
  );

  const [draft, setDraft] = useState({
    label: "",
    mappedSchemaId: "pnl",
    condition: "greaterThan",
    expected: "",
    from: "",
    to: "",
    semanticType: "number",
    tag: "EXCELLENT",
  });

  return (
    <Popup.Container>
      <Popup.Header title={"Add Field"} onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-5">
        <Section title={"Label"}>
          <Input
            value={draft.label}
            placeholder={"Enter Label"}
            classNames={{ input: "!min-w-full" }}
            onChange={(v) => setDraft((p) => ({ ...p, label: v }))}
          />
        </Section>
        <Section title={"Map To"}>
          <Select
            options={schemas}
            getLabel={(s) => s.label}
            getKey={(s) => s.id}
            value={draft.mappedSchemaId}
            classNames={{ button: "!min-w-full" }}
            onChange={(s) =>
              setDraft((p) => ({
                ...p,
                mappedSchemaId: s.id,
                semanticType: s.semanticType,
                condition: FILTER_TYPE[s.semanticType][0],
              }))
            }
          />
        </Section>

        <Section title={"Condition"}>
          <Select
            options={FILTER_TYPE[draft.semanticType]}
            getLabel={(l) => FILTER_OPTIONS[l]}
            classNames={{ button: "!min-w-full" }}
            value={draft.condition}
            onChange={(v) => setDraft((p) => ({ ...p, condition: v }))}
          />
        </Section>

        <Section title={"Expected Value"}>
          {isBetween(draft.condition) ? (
            <RangeInput
              type={draft.semanticType}
              value={{ from: draft.from, to: draft.to }}
              onChange={({ from, to }) => setDraft((p) => ({ ...p, from, to }))}
            />
          ) : (
            <Input
              vertical={true}
              placeholder={"Enter Value"}
              type={draft.semanticType}
              value={draft.expected}
              classNames={{ input: "!min-w-full" }}
              onChange={(v) => setDraft((p) => ({ ...p, expected: v }))}
            />
          )}
        </Section>
        <Section title={"Tag"}>
          <TagSelector
            value={draft.tag}
            onChange={(tag) => setDraft((p) => ({ ...p, tag }))}
          />
        </Section>
      </Popup.Body>

      <Popup.Footer
        text={["Cancel", "Add"]}
        onApply={() => null}
        onCancel={closePopup}
      />
    </Popup.Container>
  );
}

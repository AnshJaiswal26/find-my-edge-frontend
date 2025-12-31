import { useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "../../store";
import { Popup } from "@layout";

export default function AddColumnPopup() {
  const isOpen = useTableStore((s) => s.activePopup === "add-column");

  if (!isOpen) return null;

  return <AddColumnPopupConent />;
}

function AddColumnPopupConent() {
  const { addColumn, closePopup } = useTableStore.getState();

  const [draft, setDraft] = useState({
    label: "",
    type: "computed",
    editable: true,
    options: [],
    dependsOn: [],
    display: { format: "", decimals: 2, prefix: "", suffix: "" },
    expression: null,
    formula: "",
    colorRules: [],
  });

  const save = () => {
    if (!draft.label) return;
    addColumn({ id: crypto.randomUUID(), ...draft });
    closePopup();
  };

  return (
    <Popup open>
      <Popup.Container className="h-110!">
        <Popup.Header title="Add Metric" onClose={closePopup} />

        <Popup.Body className="!p-4 space-y-4 items-center">
          <ColumnDetails
            column={{ type: draft.type, dependsOn: draft.dependsOn }}
            draft={draft}
            onDraftChange={setDraft}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Cancel", "Add Column"]}
          onCancel={closePopup}
          onApply={save}
        />
      </Popup.Container>
    </Popup>
  );
}

import { useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { createColumn } from "@table/model";

export default function AddColumnPopup() {
  const { addColumn, closePopup } = useTableStore.getState();

  const [draft, setDraft] = useState(
    createColumn({
      id: "id",
    }),
  );

  const save = () => {
    if (!draft.label) return;
    console.time("save");
    addColumn({ ...draft, id: crypto.randomUUID() });
    closePopup();
    console.timeEnd("save");
  };

  return (
    <Popup.Container className="h-110!">
      <Popup.Header title="Add Metric" onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-4 items-center">
        <ColumnDetails
          column={{ type: draft.type, dependencies: draft.dependencies }}
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
  );
}

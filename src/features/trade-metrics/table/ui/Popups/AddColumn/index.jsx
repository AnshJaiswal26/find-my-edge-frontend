import { useMemo, useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { createSchema } from "@lib/analytics/schema";
import { isValid } from "@table/validation";

export default function AddColumnPopup() {
  const { addColumn, closePopup, columnsById } = useTableStore.getState();

  const [draft, setDraft] = useState(
    createSchema({
      id: "id",
    }),
  );

  const [error, setError] = useState(null);

  const columns = useMemo(() => Object.values(columnsById), []);

  const save = () => {
    if (!isValid(draft, setError, { columns })) return;

    console.time("save");
    addColumn({
      ...draft,
      id: crypto.randomUUID(),
      editable: !draft.type.includes("computed"),
    });
    console.log(draft);
    closePopup();
    console.timeEnd("save");
  };

  return (
    <Popup.Container className="h-110!">
      <Popup.Header title="Add Metric" onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-4 items-center">
        <ColumnDetails
          columns={columns}
          draft={draft}
          onDraftChange={setDraft}
          error={error}
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

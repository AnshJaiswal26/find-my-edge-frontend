import { useMemo, useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { createSchema } from "@lib/analytics/schema";

export default function AddColumnPopup() {
  const { addColumn, closePopup, columnsById, columnOrder } =
    useTableStore.getState();

  const [draft, setDraft] = useState(
    createSchema({
      id: "id",
    }),
  );

  const [error, setError] = useState("");

  const columns = useMemo(() => Object.values(columnsById), []);

  const isDuplicateLabel = () => {
    const newLabel = draft.label?.trim().toLowerCase();
    if (!newLabel) return false;

    return columnOrder.some((id) => {
      const col = columnsById[id];
      return col?.label?.trim().toLowerCase() === newLabel;
    });
  };

  const save = () => {
    const label = draft.label?.trim();

    if (!label) {
      setError("Label is required");
      return;
    }

    if (isDuplicateLabel()) {
      setError("A column with this label already exists");
      return;
    }

    setError("");

    console.time("save");
    addColumn({ ...draft, id: crypto.randomUUID(), label });
    console.log(draft);
    closePopup();
    console.timeEnd("save");
  };

  return (
    <Popup.Container className="h-110!">
      <Popup.Header title="Add Metric" onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-4 items-center">
        {error && (
          <div className="text-sm text-red-500 w-full text-left">{error}</div>
        )}
        <ColumnDetails
          columns={columns}
          draft={draft}
          onDraftChange={(d) => {
            setDraft(d);
            if (error) setError(""); // clear error on change
          }}
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

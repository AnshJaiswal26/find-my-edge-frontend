import { useState } from "react";
import { Popup } from "@layout";
import { Select } from "@ui";
import { SORT_TYPE, SORT_OPTIONS } from "@utils";
import { useTableStore } from "@table/store/useTableStore";

export default function SortPopup() {
  const columnsById = useTableStore((s) => s.columnsById);
  const sort = useTableStore((s) => s.sort);

  const [draft, setDraft] = useState(sort);

  const { updateSort, applySort, clearSort, closePopup } =
    useTableStore.getState();

  return (
    <Popup open>
      <Popup.Container className="w-100! h-65! max-w-50">
        <Popup.Header title="Sort" onClose={closePopup} />

        <Popup.Body className="px-4 py-4 flex flex-col gap-4">
          {/* Column */}
          <Select
            label="Column"
            options={Object.values(columnsById)}
            getLabel={(o) => o.label}
            getKey={(o) => o.id}
            value={draft.columnId}
            onChange={(o) => setDraft({ columnId: o.id, operator: "none" })}
          />
          {/* Sort type */}
          <Select
            label="Sort Order"
            options={
              SORT_TYPE[columnsById[draft?.columnId]?.semanticType] ?? ["none"]
            }
            getLabel={(o) => SORT_OPTIONS[o]}
            value={draft.operator}
            onChange={(o) =>
              setDraft((p) => ({ columnId: p.columnId, operator: o }))
            }
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => {
            setDraft({ columnId: null, operator: "none" });
            clearSort();
          }}
          onApply={() => {
            updateSort(draft.columnId, draft.operator);
            applySort();
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

import { useState } from "react";
import { Popup } from "@layout";
import { GroupByBuilder } from "@ui";
import { useTableStore } from "@table/store/useTableStore";

export default function GroupByPopup() {
  const columnsById = useTableStore((s) => s.columnsById);
  const groupBy = useTableStore((s) => s.groupBy);
  const { setGroupBy, clearGroupBy, closePopup } = useTableStore.getState();

  const [draft, setDraft] = useState(groupBy ?? {});

  return (
    <Popup open>
      <Popup.Container>
        <Popup.Header title="Group By" onClose={closePopup} />

        <Popup.Body className="flex flex-col gap-4 p-5!">
          <GroupByBuilder
            schemasById={columnsById}
            groupBy={draft}
            onChange={setDraft}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={clearGroupBy}
          onApply={() => {
            if (!draft.key || !draft.kind) return;
            setGroupBy(draft);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

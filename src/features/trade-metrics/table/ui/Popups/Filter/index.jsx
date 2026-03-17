import { Popup } from "@shared/components/layout";
import { useTableStore } from "@features/trade-metrics/table/store";
import { FilterBuilder } from "@shared/components/ui";
import { useTradeStore } from "@shared/stores";
import { useMemo, useState } from "react";

export default function FilterPopup() {
  const appliedfilters = useTableStore((s) => s.filters);

  const schemasOrder = useTradeStore((s) => s.schemasOrder);
  const schemasById = useTradeStore((s) => s.schemasById);

  const schemas = useMemo(
    () => schemasOrder.map((id) => schemasById[id]),
    [schemasById, schemasOrder],
  );

  const [filters, setFilters] = useState([...appliedfilters]);

  const { clearFilters, closePopup, applyFilters } = useTableStore.getState();

  return (
    <Popup open>
      <Popup.Container className="w-50 max-w-50">
        <Popup.Header title="Filters" onClose={closePopup} />

        <Popup.Body className="px-4 py-3 flex flex-col gap-4 justify-between">
          <FilterBuilder
            filters={filters}
            fieldOptions={schemas}
            getKey={(s) => s.field}
            getType={(key) => schemasById[key]?.semanticType}
            setFilters={setFilters}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={clearFilters}
          onApply={() => applyFilters(filters)}
        />
      </Popup.Container>
    </Popup>
  );
}

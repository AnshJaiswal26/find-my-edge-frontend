import { useState } from "react";
import { Popup } from "@shared/components/layout";

import { FilterBuilder } from "@shared/components/ui";
import { useChartStore } from "@modules/charts/apex/store";

export default function FilterPopup({ chartId, schemasById }) {
  const appliedfilters = useChartStore((s) => s.charts[chartId].filters);

  const clearFilters = useChartStore((s) => s.clearFilters);
  const closePopup = useChartStore((s) => s.closePopup);
  const applyFilters = useChartStore((s) => s.applyFilters);

  const seriesConfig = useChartStore((s) => s.charts[chartId].series);

  const [filters, setFilters] = useState([...appliedfilters]);

  const addFilter = () => {
    setFilters((f) => [
      ...f,
      { key: "", operator: "none", value: 0, from: 0, to: 0 },
    ]);
  };

  const updateFilter = (index, patch) => {
    setFilters((f) =>
      f.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const removeFilter = (index) => {
    setFilters((f) => f.filter((_, i) => i !== index));
  };

  return (
    <Popup open>
      <Popup.Container className="w-50 max-w-50">
        <Popup.Header title="Filters" onClose={closePopup} />

        <Popup.Body className="px-4 py-3 flex flex-col gap-4 justify-between">
          <FilterBuilder
            filters={filters}
            fieldOptions={seriesConfig}
            getFieldType={(key) => schemasById[key].semanticType}
            addFilter={addFilter}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => clearFilters(chartId)}
          onApply={() => {
            applyFilters(chartId, filters);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

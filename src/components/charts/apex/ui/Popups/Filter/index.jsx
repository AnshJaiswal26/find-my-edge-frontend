import { useState } from "react";
import { Popup } from "@layout";

import { FilterBuilder } from "@ui";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { useDashboardStore } from "@features/dashboard/store";

export default function FilterPopup({ chartId }) {
  const appliedfilters = useChartStore((s) => s[chartId].filters);
  const schemasById = useDashboardStore((s) => s.schemasById);

  const [filters, setFilters] = useState([...appliedfilters]);

  const ySeriesConfig = useChartStore((s) => s[chartId].ySeriesConfig);
  const xSeriesConfig = useChartStore((s) => s[chartId].xSeriesConfig);

  const seriesConfig = [...ySeriesConfig, xSeriesConfig];

  const { clearFilters, closePopup, applyFilters } = useChartStore.getState();

  const addFilter = () => {
    setFilters((f) => [
      ...f,
      { key: "", operator: "none", value: "", value2: "" },
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
            getFieldMeta={(key) => schemasById[key]}
            addFilter={addFilter}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => clearFilters(chartId)}
          onApply={() => applyFilters(chartId, filters)}
        />
      </Popup.Container>
    </Popup>
  );
}

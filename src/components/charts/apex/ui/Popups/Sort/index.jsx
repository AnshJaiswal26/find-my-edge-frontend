import { useState } from "react";
import { Popup } from "@layout";
import { Select } from "@ui";
import { sortOptions } from "@utils";
import { useChartStore } from "@charts/apex/store/useChartStore";

export default function SortPopup({ chartId }) {
  const sort = useChartStore((s) => s[chartId].sort);

  const ySeriesConfig = useChartStore((s) => s[chartId].seriesConfig);
  const xSeriesConfig = useChartStore((s) => s[chartId].xSeriesConfig);

  const [draft, setDraft] = useState(sort);

  const seriesConfig = [...ySeriesConfig, xSeriesConfig];

  const { applySort, updateSort, clearSort, closePopup } =
    useChartStore.getState();

  return (
    <Popup open>
      <Popup.Container className="w-100! h-65! max-w-50">
        <Popup.Header title="Sort" onClose={closePopup} />

        <Popup.Body className="px-4 py-4 flex flex-col gap-4">
          {/* Column */}
          <Select
            label="Column"
            options={seriesConfig}
            getLabel={(o) => o.name}
            getKey={(o) => o.key}
            value={draft.key}
            onChange={(o) => setDraft({ key: o.key, operator: "none" })}
          />
          {/* Sort type */}
          <Select
            label="Sort Order"
            options={Object.keys(sortOptions)}
            getLabel={(o) => sortOptions[o]}
            value={draft.operator}
            onChange={(o) => setDraft((p) => ({ ...p, operator: o }))}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => {
            setDraft({ key: null, operator: "none" });
            clearSort(chartId);
          }}
          onApply={() => {
            applySort(chartId, draft.key, draft.operator);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}

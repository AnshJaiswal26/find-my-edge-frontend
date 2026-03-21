import { Popup } from "@shared/components/layout";
import { PopupSideList } from "@shared/components/ui";
import { useMemo, useRef, useState } from "react";
import { useDashboardStore } from "@features/dashboard/store";
import AddChartForm from "./AddChartForm";
import { AddStatsForm } from "./AddStatsForm";
import { useTradeStore } from "@shared/stores";

const CHART_TYPES = [
  { id: "stat", label: "Stat Card" },
  { id: "bar", label: "Bar chart" },
  { id: "line", label: "Line chart" },
  { id: "donut", label: "Donut chart" },
  { id: "radialBar", label: "Radial Bar" },
  { id: "polarArea", label: "Polar Area" },
  { id: "radar", label: "Radar" },
];

export default function AddWidgetPopup() {
  const isOpen = useDashboardStore((s) => s.activePopup === "widget");
  if (!isOpen) return null;

  return <AddWidgetPopupContent />;
}

function AddWidgetPopupContent() {
  const formRef = useRef(null);

  const schemasById = useTradeStore((s) => s.schemasById);

  const { closePopup } = useDashboardStore.getState();

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const options = useMemo(() => Object.values(schemasById), [schemasById]);

  return (
    <Popup open>
      <Popup.Container className="max-w-200! w-156!">
        {" "}
        <Popup.Header title="Add StatCard" onClose={closePopup} />
        <Popup.Body>
          <PopupSideList
            activeIndex={activeIndex}
            items={CHART_TYPES}
            getLabel={(i) => i.label}
            onSelectIndex={setActiveIndex}
            renderDetails={(item, index) =>
              index === 0 ? (
                <AddStatsForm
                  key={index}
                  ref={formRef}
                  options={options}
                  schemasById={schemasById}
                  setLoading={setLoading}
                />
              ) : (
                <div className="space-y-4">
                  <AddChartForm
                    key={index}
                    type={item.id}
                    ref={formRef}
                    options={options}
                    setLoading={setLoading}
                    schemasById={schemasById}
                  />{" "}
                </div>
              )
            }
            getSection={(index) =>
              index === 0 ? "stats" : index === 1 ? "charts" : null
            }
          />
        </Popup.Body>
        <Popup.Footer
          text={["Cancel", "Add"]}
          onApply={() => formRef.current?.submit?.()}
          onCancel={closePopup}
          loading={{ apply: loading }}
          disableApply={loading}
          disableCancel={loading}
        />
      </Popup.Container>
    </Popup>
  );
}

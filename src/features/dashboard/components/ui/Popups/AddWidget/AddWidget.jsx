import { Popup } from "@shared/components/layout";
import { PopupSideList } from "@shared/components/ui";
import { useMemo, useRef, useState } from "react";
import { useDashboardStore } from "@features/dashboard/store";
import AddChartForm from "./AddChartForm";
import { AddStatsForm } from "./AddStatsForm";

const CHART_TYPES = [
  { id: "stat", label: "Stat Card" },
  { id: "bar", label: "Bar Chart" },
  { id: "line", label: "Line Chart" },
  { id: "donut", label: "Donut Chart" },
  { id: "radialBar", label: "Radial Bar" },
  { id: "polarArea", label: "Polar Area" },
  { id: "radar", label: "Radar" },
];

export default function AddWidgetPopup({ schemasById }) {
  const isOpen = useDashboardStore((s) => s.activePopup === "widget");
  if (!isOpen) return null;

  return <AddWidgetPopupContent schemasById={schemasById} />;
}

function AddWidgetPopupContent({ schemasById }) {
  const formRef = useRef(null);

  const { closePopup } = useDashboardStore.getState();

  const [activeIndex, setActiveIndex] = useState(0);

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
                />
              ) : (
                <div className="space-y-4">
                  <AddChartForm
                    key={index}
                    type={item.id}
                    ref={formRef}
                    options={options}
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
        />
      </Popup.Container>
    </Popup>
  );
}

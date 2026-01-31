import { Popup } from "@layout";
import { SidePanelPopup } from "@ui";
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

export default function AddWidgetPopup() {
  const formRef = useRef(null);

  const activePopup = useDashboardStore((s) => s.activePopup);

  const { closePopup, schemasById } = useDashboardStore.getState();

  const [activeIndex, setActiveIndex] = useState(0);

  const options = useMemo(() => Object.values(schemasById), [schemasById]);

  if (activePopup !== "widget") return null;

  return (
    <Popup open>
      <Popup.Container className="max-w-200! w-136!">
        {" "}
        <Popup.Header title="Add StatCard" onClose={closePopup} />
        <Popup.Body>
          <SidePanelPopup
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
        {/* <AddStatForm /> */}
        <Popup.Footer
          text={["Cancel", "Add"]}
          onApply={() => formRef.current?.submit?.()}
          onCancel={closePopup}
        />
      </Popup.Container>
    </Popup>
  );
}

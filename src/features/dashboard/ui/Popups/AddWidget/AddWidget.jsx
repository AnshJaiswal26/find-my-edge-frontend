import { Popup } from "@layout";
import { Input, Select, SidePanelPopup } from "@ui";
import { useState } from "react";
import { useDashboardStore } from "@features/dashboard/store";

import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { DEFAULT_FORMATS, FORMATS } from "@utils";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";
import AddChartForm from "./AddChartForm";

function AddStatForm({}) {
  const schemasById = useDashboardStore((s) => s.schemasById);
  const closePopup = useDashboardStore((s) => s.closePopup);
  const addStats = useDashboardStore((s) => s.addStats);

  const options = Object.values(schemasById);

  const [stat, setStat] = useState({
    key: options[0].id,
    title: "",
    aggregate: "",
    format: options[0].display?.format ?? "NUMBER",
    type: options[0].type ?? "number",
  });

  const submit = () => {
    addStats([
      {
        title: stat.title,
        key: stat.key,
        aggregate: stat.aggregate,
        format: stat.format,
        type: stat.type,
        value: 0,
      },
    ]);
  };

  return (
    <>
      <Popup.Body className="px-0!">
        <div className="flex flex-col gap-3">
          <Input
            vertical
            label={"Title"}
            value={stat.title}
            placeholder="Enter card title"
            onCommit={(v) => setStat((s) => ({ ...s, title: v }))}
            classNames={{ input: "max-w-full!" }}
          />
          <Select
            label="Metric"
            options={options}
            value={stat.key}
            getLabel={(s) => s.label}
            getKey={(s) => s.id}
            onChange={(o) =>
              setStat((s) => ({
                ...s,
                key: o.id,
                type: o.type,
                format: o.display?.format ?? "NUMBER",
              }))
            }
          />

          <Select
            label="Aggregate"
            value={stat.aggregate.replace("_N", "")}
            options={Object.keys(WINDOW_FUNCTIONS).map((k) =>
              k.replace("_N", ""),
            )}
            onChange={(o) =>
              setStat((s) => ({
                ...s,
                aggregate: `${o}_N`,
              }))
            }
          />

          <Select
            label="Format"
            value={stat.format || DEFAULT_FORMATS[schemasById[stat.key].type]}
            options={FORMATS[schemasById[stat.key].type]}
            onChange={(o) => setStat((s) => ({ ...s, format: o }))}
          />
        </div>
      </Popup.Body>

      {/* <Popup.Footer
        text={["Cancel", "Add"]}
        onApply={submit}
        onCancel={closePopup}
      /> */}
    </>
  );
}

export default function AddWidgetPopup() {
  const activePopup = useDashboardStore((s) => s.activePopup);
  const closePopup = useDashboardStore((s) => s.closePopup);
  const schemasById = useDashboardStore((s) => s.schemasById);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddClicked, setIsAddClicked] = useState(false);

  if (activePopup !== "widget") return null;

  const options = Object.values(schemasById);

  return (
    <Popup open>
      <Popup.Container className="max-w-200! w-136!">
        {" "}
        <Popup.Header title="Add StatCard" onClose={closePopup} />
        <Popup.Body>
          <SidePanelPopup
            activeIndex={activeIndex}
            items={[
              "Statcard",
              "Bar",
              "Line",
              "Donut",
              "Raidal Bar",
              "PolarArea",
              "Radar",
            ]}
            onSelectIndex={setActiveIndex}
            renderDetails={(_, index) =>
              index === 0 ? (
                <AddStatForm options={options} isAddClicked={isAddClicked} />
              ) : (
                <AddChartForm options={options} isAddClicked={isAddClicked} />
              )
            }
            getSection={(index) =>
              index === 0 ? "Stats" : index === 1 ? "charts" : null
            }
          />
        </Popup.Body>
        {/* <AddStatForm /> */}
        <Popup.Footer
          text={["Cancel", "Add"]}
          onApply={() => {
            setIsAddClicked(true);
          }}
          onCancel={closePopup}
        />
      </Popup.Container>
    </Popup>
  );
}

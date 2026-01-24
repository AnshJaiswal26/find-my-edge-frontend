import { Popup } from "@layout";
import { Input, Select } from "@ui";
import { useState } from "react";
import { useDashboardStore } from "@features/dashboard/store";

import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { DEFAULT_FORMATS, FORMATS } from "@utils";

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
      <Popup.Header title="Add StatCard" onClose={closePopup} />

      <Popup.Body className="p-4">
        <div className="flex flex-col gap-3 p-2">
          <Input
            label={"Title"}
            value={stat.title}
            onCommit={(v) => setStat((s) => ({ ...s, title: v }))}
            classNames={{ input: "max-w-50" }}
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
            options={Object.keys(FUNCTION_REGISTRY)
              .filter((k) => k.includes("_N"))
              .map((k) => k.replace("_N", ""))}
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

      <Popup.Footer
        text={["Cancel", "Add"]}
        onApply={submit}
        onCancel={closePopup}
      />
    </>
  );
}

export default function AddWidgetPopup() {
  const activePopup = useDashboardStore((s) => s.activePopup);

  if (activePopup !== "widget") return;

  return (
    <Popup open>
      <Popup.Container className="w-96">
        <AddStatForm />
      </Popup.Container>
    </Popup>
  );
}

import { useRef, useState } from "react";
import { IconButton } from "../Buttons";
import { Settings2 } from "lucide-react";
import { ChartPopup, ColorPicker, Legend } from "@layout";
import { useClickOutside } from "@hooks";
import { useChartStore } from "@stores";

export default function ChartLayoutPopup({ chartId }) {
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const ref = useRef();

  const layout = useChartStore((s) => s.charts[chartId].layout);
  const [layoutCfg, setLayoutCfg] = useState(layout);

  const updateLayout = useChartStore((s) => s.updateLayout);
  const updateMeta = useChartStore((s) => s.updateMeta);
  const chartTitle = useChartStore((s) => s.charts[chartId].title);

  useClickOutside(ref, () => setShowLayoutPopup(false));

  return (
    <div ref={ref} className="relative">
      <IconButton
        className={"rounded-none"}
        icon={<Settings2 size={15} />}
        tooltip={{ title: "Layout", position: "bottom" }}
        onClick={() => setShowLayoutPopup((p) => !p)}
      />

      <ChartPopup
        title={"Layout"}
        isVisible={showLayoutPopup}
        text={{ leftBtn: "Cancel", rightBtn: "Apply" }}
        onRightBtnClick={() => {
          updateLayout(chartId, layoutCfg);
        }}
      >
        <div>
          <span>Title</span>
          <input
            type="text"
            value={chartTitle}
            onChange={(e) =>
              setLayoutCfg((p) => ({ ...p, title: e.target.value }))
            }
          />
        </div>
        <div>
          <ColorPicker
            label={"xaxis"}
            color={
              layoutCfg.yLabelsColor.includes("--")
                ? "#fe5a5a"
                : layoutCfg.yLabelsColor
            }
            disable={!layoutCfg.yLabels}
            onToggle={() =>
              setLayoutCfg((p) => ({ ...p, yLabels: !p.yLabels }))
            }
            onChange={(c) => setLayoutCfg((p) => ({ ...p, yLabelsColor: c }))}
          />
        </div>
      </ChartPopup>
    </div>
  );
}

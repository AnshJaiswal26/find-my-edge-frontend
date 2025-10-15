import { useEffect, useRef, useState } from "react";
import { IconButton, ToggleButton } from "../../Buttons";
import { Settings2 } from "lucide-react";
import { ChartPopup, Section } from "@layout";
import { useClickOutside } from "@hooks";
import { useChartStore } from "@stores";
import styles from "../ChartLayoutPopup.module.css";
import { XAxisSection } from "./XAxisSection";
import { parseColor } from "@utils";
import InputField from "../../InputField";
import ColorPicker from "../../ColorPicker";

export default function BarChartLayoutPopup({ chartId }) {
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const ref = useRef();

  const layout = useChartStore((s) => s.charts[chartId].layout);
  const updateLayout = useChartStore((s) => s.updateLayout);

  const [isAnyChange, setIsAnyChange] = useState(false);

  const [generalLayout, setGeneralLayout] = useState({
    title: layout.title,
    tooltip: layout.tooltip,
    dataLabels: layout.dataLabels,
  });

  const [dimensions, setDimensions] = useState(parseInt(layout.wrapperWidth));

  const [gridLayout, setGridLayout] = useState({
    gridEnabled: layout.gridEnabled,
    xGrid: layout.xGrid,
    yGrid: layout.yGrid,
  });

  const [barLayout, setBarLayout] = useState({
    horizontal: layout.horizontal,
    stacked: layout.stacked,
    stacked100: layout.stacked100,
    barRadius: layout.barRadius,
  });

  const [yaxisLayout, setYaxisLayout] = useState({
    tooltip: layout.yTooltip,
    labels: layout.yLabels,
    labelsColor: layout.yLabelsColor,
    titleText: layout.yTitleText,
    titleColor: layout.yTitleColor,
    labelPrefix: layout.yLabelPrefix,
  });

  useClickOutside(ref, () => {
    document.body.style.overflow = "";
    setShowLayoutPopup(false);
  });

  // useEffect(() => {
  //   const isChanged = JSON.stringify(layout) !== JSON.stringify(layoutCfg);
  //   setIsAnyChange(isChanged);
  // }, [layoutCfg]);

  return (
    <div ref={ref} className="relative">
      <IconButton
        className="rounded-none p-2.5"
        icon={<Settings2 size={15} />}
        tooltip={{ title: "Layout", position: "bottom" }}
        onClick={() => {
          setShowLayoutPopup((p) => {
            document.body.style.overflow = !p ? "hidden" : "";
            return !p;
          });
        }}
      />

      <ChartPopup
        title={"Layout"}
        isVisible={showLayoutPopup}
        text={{ leftBtn: "Cancel", rightBtn: isAnyChange ? "Apply" : "Ok" }}
        onRightBtnClick={() => updateLayout(chartId, tempUpdates)}
      >
        <div className={styles.contentWrapper}>
          <Section title="General">
            <InputField
              label="Title"
              type="text"
              value={generalLayout.title}
              onChange={(v) => setGeneralLayout((p) => ({ ...p, title: v }))}
              placeholder="Chart title"
            />
            <ToggleButton
              label={"Tooltip"}
              value={generalLayout.tooltip}
              onClick={() =>
                setGeneralLayout((p) => ({ ...p, tooltip: !p.tooltip }))
              }
            />
            <ToggleButton
              label={"Data Labels"}
              value={generalLayout.dataLabels}
              onClick={() =>
                setGeneralLayout((p) => ({ ...p, dataLabels: !p.dataLabels }))
              }
            />
          </Section>
          <Section title="Dimensions">
            <InputField
              label="Chart Width (%)"
              type="range"
              formater={(v) => `${v}%`}
              value={layout.dimensions}
              onChange={(v) => setDimensions((p) => ({ ...p, dimensions: v }))}
              min={0}
              max={10}
            />
          </Section>
          <Section title="Grid">
            {[
              { title: "Grid Enabled", key: "gridEnabled" },
              { title: "X Grid", key: "xGrid" },
              { title: "Y Grid", key: "yGrid" },
            ].map(({ title, key }, i) => (
              <ToggleButton
                key={i}
                label={title}
                value={gridLayout[key]}
                onClick={() => setGridLayout((p) => ({ ...p, [key]: !p[key] }))}
              />
            ))}
          </Section>
          <Section title="Bar Settings">
            {[
              { title: "Horizontal", key: "horizontal" },
              { title: "Stacked", key: "stacked" },
              { title: "Stacked 100%", key: "stacked100" },
            ].map(({ title, key }, i) => (
              <ToggleButton
                key={i}
                label={title}
                value={barLayout[key]}
                onClick={() => setBarLayout((p) => ({ ...p, [key]: !p[key] }))}
              />
            ))}

            <InputField
              label="Bar Radius"
              type="range"
              value={layout.barRadius}
              onChange={(v) => setBarLayout((p) => ({ ...p, barRadius: v }))}
              min={0}
              max={10}
            />
          </Section>

          <XAxisSection chartId={chartId} updateLayout={updateLayout} />

          <Section title="Y-Axis">
            <ToggleButton
              label={"Tooltip"}
              value={yaxisLayout.tooltip}
              onClick={() =>
                setYaxisLayout((p) => ({ ...p, tooltip: !p.tooltip }))
              }
            />
            <ColorPicker
              label="Labels"
              value={parseColor(yaxisLayout.labelsColor)}
              disable={!yaxisLayout.labels}
              onToggle={() => {
                setYaxisLayout((p) => ({ ...p, labels: !p.labels }));
              }}
              onChange={(c) => {
                setYaxisLayout((p) => ({ ...p, labelsColor: c }));
              }}
            />
            <InputField
              label="Title Text"
              type="text"
              value={yaxisLayout.titleText}
              onChange={(v) => setYaxisLayout((p) => ({ ...p, titleText: v }))}
              placeholder="Y-axis title"
            />

            <ColorPicker
              label="Title Color"
              value={parseColor(yaxisLayout.titleColor)}
              disable={!yaxisLayout.titleText}
              onToggle={() => setYaxisLayout((p) => ({ ...p, titleText: v }))}
              onChange={(c) => setYaxisLayout((p) => ({ ...p, titleColor: c }))}
            />
            <InputField
              label="Label Prefix"
              type="text"
              value={yaxisLayout.labelPrefix}
              onChange={(v) =>
                setYaxisLayout((p) => ({ ...p, labelPrefix: v }))
              }
              placeholder="Prefix for labels"
            />
          </Section>
        </div>
      </ChartPopup>
    </div>
  );
}

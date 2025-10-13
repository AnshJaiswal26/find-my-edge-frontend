import { useEffect, useRef, useState } from "react";
import { IconButton, ToggleButton } from "../Buttons";
import { Settings2 } from "lucide-react";
import { ChartPopup, ColorPicker, Section } from "@layout";
import { useClickOutside } from "@hooks";
import { useChartStore } from "@stores";
import styles from "./ChartLayoutPopup.module.css";
import { tooltip } from "../ValidationTooltip/data";

export default function ChartLayoutPopup({ chartId }) {
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const ref = useRef();

  const layout = useChartStore((s) => s.charts[chartId].layout);
  const updateLayout = useChartStore((s) => s.updateLayout);

  const [isAnyChange, setIsAnyChange] = useState(false);

  const tempUpdates = {};

  const triggerOnApply = (callback) => {
    callback(tempUpdates);
    console.log(tempUpdates);
  };

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

  const [xaxisLayout, setXaxisLayout] = useState({
    tooltip: layout.xTooltip,
    labels: layout.xLabels,
    labelsColor: layout.xLabelsColor,
    titleText: layout.xTitleText,
    titleColor: layout.xTitleColor,
    labelSeries: "",
    labelPrefix: layout.xLabelPrefix,
    labelIndex: layout.xLabelIndex,
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

  const parseColor = (color) => {
    const val = color.includes("--")
      ? getComputedStyle(document.documentElement).getPropertyValue(
          color.substring(4, color.length - 1)
        )
      : color;
    return val;
  };

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled = false,
  }) => (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.textInput}
      />
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <IconButton
        className={"rounded-none"}
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
              value={generalLayout.title}
              onChange={(v) => setGeneralLayout((p) => ({ ...p, title: v }))}
              placeholder="Chart title"
            />
            <ToggleButton
              label={"Tooltip"}
              toggleOn={generalLayout.tooltip}
              className="justify-between"
              onClick={() =>
                setGeneralLayout((p) => ({ ...p, tooltip: !p.tooltip }))
              }
            />
            <ToggleButton
              label={"Data Labels"}
              className="justify-between"
              toggleOn={generalLayout.dataLabels}
              onClick={() =>
                setGeneralLayout((p) => ({ ...p, dataLabels: !p.dataLabels }))
              }
            />
          </Section>

          <Section title="Dimensions">
            <RangeField
              label="Chart Width (%)"
              stateKey="dimensions"
              triggerOnApply={triggerOnApply}
              formater={(v) => `${v}%`}
              initialValue={layout.dimensions}
              min={50}
              max={100}
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
                className="justify-between"
                toggleOn={gridLayout[key]}
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
                className="justify-between"
                label={title}
                toggleOn={barLayout[key]}
                onClick={() => setBarLayout((p) => ({ ...p, [key]: !p[key] }))}
              />
            ))}
            <RangeField
              label="Bar Radius"
              stateKey="barRadius"
              triggerOnApply={triggerOnApply}
              initialValue={layout.barRadius}
              min={0}
              max={10}
            />
          </Section>

          <Section title="X-Axis">
            {[
              { title: "Tooltip", key: "tooltip" },
              { title: "Label Index", key: "labelIndex" },
            ].map(({ title, key }, i) => (
              <ToggleButton
                key={i}
                className="justify-between"
                label={title}
                toggleOn={xaxisLayout[key]}
                onClick={() =>
                  setXaxisLayout((p) => ({ ...p, [key]: !p[key] }))
                }
              />
            ))}
            <ColorPicker
              label="Labels"
              color={parseColor(xaxisLayout.labelsColor)}
              disable={!xaxisLayout.labels}
              onToggle={() => {
                setXaxisLayout((p) => ({ ...p, labels: !p.labels }));
              }}
              onChange={(c) => {
                setXaxisLayout((p) => ({ ...p, labelsColor: c }));
              }}
            />
            <InputField
              label="Title Text"
              value={xaxisLayout.titleText}
              onChange={(v) => setXaxisLayout((p) => ({ ...p, titleText: v }))}
              placeholder="X-axis title"
            />
            <ColorPicker
              label="Title Color"
              color={parseColor(xaxisLayout.titleColor)}
              disable={!xaxisLayout.titleText}
              onToggle={() => {}}
              onChange={(c) => {
                setXaxisLayout((p) => ({ ...p, titleColor: c }));
              }}
            />
            <InputField
              label="Label Prefix"
              value={xaxisLayout.labelPrefix}
              onChange={(v) =>
                setXaxisLayout((p) => ({ ...p, labelPrefix: v }))
              }
              placeholder="Prefix for labels"
            />
          </Section>

          <Section title="Y-Axis">
            <ToggleButton
              className="justify-between"
              label={"Tooltip"}
              toggleOn={yaxisLayout.tooltip}
              onClick={() =>
                setYaxisLayout((p) => ({ ...p, tooltip: !p.tooltip }))
              }
            />
            <ColorPicker
              label="Labels"
              color={parseColor(yaxisLayout.labelsColor)}
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
              value={yaxisLayout.titleText}
              onChange={(v) => setYaxisLayout((p) => ({ ...p, titleText: v }))}
              placeholder="Y-axis title"
            />
            <ColorPicker
              label="Title Color"
              color={parseColor(yaxisLayout.titleColor)}
              disable={!yaxisLayout.titleText}
              onToggle={() => {}}
              onChange={(c) => setYaxisLayout((p) => ({ ...p, titleColor: c }))}
            />
            <InputField
              label="Label Prefix"
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

function RangeField({
  label,
  stateKey,
  min,
  max,
  step = 1,
  triggerOnApply,
  initialValue,
  formater = (v) => v,
}) {
  const [range, setRange] = useState(initialValue);

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="range"
          value={range}
          onChange={(e) => {
            const val = Number(e.target.value);
            triggerOnApply((updates) => (updates[stateKey] = val));
            setRange(val);
          }}
          min={min}
          max={max}
          step={step}
        />
        {formater(range)}
      </div>
    </div>
  );
}

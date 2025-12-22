import { Popup } from "@layout";
import styles from "./ManageSeriesPopup.module.css";
import { tradeData } from "@data";
import { useChartStore } from "@stores";
import { useState } from "react";
import { Button } from "@ui";
import { Plus, Trash2 } from "lucide-react";

const seriesCfgGenerator = {
  bar: (key) => ({
    key,
    name: key,
    colors: [
      {
        from: 0,
        to: Number.MAX_SAFE_INTEGER,
        color: "var(--info)",
        tooltipLabel: key,
      },
    ],
  }),
  line: (key) => ({
    key,
    name: key,
    tooltipLabel: key,
    color: "var(--info)",
    markerColor: "var(--info)",
    areaColor: "var(--info)",
  }),
};

function MetricsSection({
  title,
  list = [],
  icon: Icon,
  onClick,
  disable = false,
  color = "info",
  className = "selectedMetricsList",
}) {
  return (
    <div className={styles.section}>
      <div className="pl-1">
        <span>{title}</span>
      </div>
      <div className={styles[className]}>
        {list.length === 0 ? (
          <div className="self-center text-[var(--text-disabled)]">
            No Selected Metrics
          </div>
        ) : (
          list.map((key, index) => (
            <div
              key={index}
              className={`${styles.listRow} ${disable ? styles.disable : ""}`}
            >
              <div className={`text-(--${color})`}>
                <span>{key}</span>
              </div>

              <Button.Icon onClick={() => onClick(key)}>
                <Icon size={16} className="text-inherit" />
              </Button.Icon>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ManageSeriesPopup({ chartId, type, updateChart }) {
  const seriesConfig = useChartStore((s) => s[chartId].draft.seriesConfig);
  const currentSeries = seriesConfig.map((cfg) => cfg.key);

  const [selected, setSelected] = useState([]);

  const availableMetrics = Object.keys(tradeData[0]).filter(
    (k) => !currentSeries.includes(k) && !selected.includes(k)
  );

  const handleClose = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
      chart.draft.seriesConfig = chart.live.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    updateChart(chartId, (chart, s) => {
      const selectedMetrics = selected.map((k) => seriesCfgGenerator[type](k));
      s.activeChart.activePopup = null;
      chart.live.seriesConfig = [
        ...chart.draft.seriesConfig,
        ...selectedMetrics,
      ];
      chart.draft.seriesConfig = [
        ...chart.draft.seriesConfig,
        ...selectedMetrics,
      ];
    });
    document.body.style.overflow = "";
  };

  return (
    <Popup open={true}>
      <Popup.Container>
        {/* Header */}
        <Popup.Header title="Manage Series" onClose={handleClose} />

        {/* Body */}
        <Popup.Body>
          <div className={styles.contentWrapper}>
            {/* Note */}
            <div className="text-[var(--error)] text-[0.8rem]">
              <strong>Note:</strong> You can have up to 3 active series at a
              time, and at least 1 must remain active.
            </div>

            {/* Content */}
            <div className="flex gap-3">
              {/* Available Metrics */}
              <MetricsSection
                title="Available Metrics"
                list={availableMetrics}
                icon={Plus}
                disable={selected.length + currentSeries.length > 2}
                onClick={(k) => setSelected((p) => [...p, k])}
                className="availableMetricsList"
              />

              <div className={styles.section}>
                {/* Active Metrics */}
                <MetricsSection
                  title="Active Metrics"
                  list={currentSeries}
                  icon={Trash2}
                  disable={currentSeries.length < 2}
                  color="success"
                  className="activeMetricsList"
                  onClick={(k) =>
                    updateChart(chartId, (chart) => {
                      chart.draft.seriesConfig =
                        chart.draft.seriesConfig.filter((s) => s.key !== k);
                    })
                  }
                />

                {/* Selected Metrics */}
                <MetricsSection
                  title="Selected Metrics"
                  list={selected}
                  icon={Trash2}
                  color="warning"
                  className="selectedMetricsList"
                  onClick={(k) => setSelected((p) => p.filter((i) => i !== k))}
                />
              </div>
            </div>
          </div>
        </Popup.Body>

        {/* Footer */}
        <Popup.Footer
          text={["Cancel", "Apply"]}
          onCancel={handleClose}
          onApply={handleApply}
        />
      </Popup.Container>
    </Popup>
  );
}

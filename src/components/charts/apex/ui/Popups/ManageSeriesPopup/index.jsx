import { Popup } from "@layout";
import styles from "./ManageSeriesPopup.module.css";
import { tradeData } from "@data";
import { useState } from "react";
import { Button } from "@ui";
import { Plus, Trash2 } from "lucide-react";
import { useChartStore } from "@stores";

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
  const [selected, setSelected] = useState([]);

  const chart = useChartStore.getState()[chartId];
  const [seriesDraft, setSeriesDraft] = useState([...chart.seriesConfig]);

  const currentKeys = seriesDraft.map((s) => s.key);

  const availableMetrics = Object.keys(tradeData[0]).filter(
    (k) => !currentKeys.includes(k) && !selected.includes(k)
  );

  const handleCancel = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    const newSeries = selected.map((k) => seriesCfgGenerator[type](k));

    const finalSeries = [...seriesDraft, ...newSeries];

    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
      chart.seriesConfig = finalSeries;
    });

    document.body.style.overflow = "";
  };

  return (
    <Popup open>
      <Popup.Container>
        <Popup.Header title="Manage Series" onClose={handleCancel} />

        <Popup.Body>
          <div className={styles.contentWrapper}>
            <div className="text-[var(--error)] text-[0.8rem]">
              <strong>Note:</strong> You can have up to 3 active series at a
              time, and at least 1 must remain active.
            </div>

            <div className="flex gap-3">
              {/* Available */}
              <MetricsSection
                title="Available Metrics"
                list={availableMetrics}
                icon={Plus}
                disable={selected.length + currentKeys.length > 2}
                onClick={(k) => setSelected((p) => [...p, k])}
                className="availableMetricsList"
              />

              <div className={styles.section}>
                {/* Active */}
                <MetricsSection
                  title="Active Metrics"
                  list={currentKeys}
                  icon={Trash2}
                  color="success"
                  disable={currentKeys.length < 2}
                  className="activeMetricsList"
                  onClick={(k) =>
                    setSeriesDraft((p) => p.filter((s) => s.key !== k))
                  }
                />

                {/* Selected */}
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

        <Popup.Footer
          text={["Cancel", "Apply"]}
          onCancel={handleCancel}
          onApply={handleApply}
        />
      </Popup.Container>
    </Popup>
  );
}

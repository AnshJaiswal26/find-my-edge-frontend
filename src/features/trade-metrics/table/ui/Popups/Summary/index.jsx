import { Popup } from "@shared/components/layout";
import { useTableStore } from "@features/trade-metrics/table/store";
import { MetricStatsRow } from "./MetricStatsRow";
import { KpiGrid } from "./KpiGrid";
import { MetricTableHeader } from "./MetricTableHeader";
import { formatValue } from "@shared/utils";
import { useTradeStore } from "@shared/stores";
import { SCHEMA_TYPE, SEMANTIC_TYPE } from "@lib/analytics/schema";

function Divider() {
  return <div className="h-px bg-(--border)" />;
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold uppercase text-(--muted)">
      {children}
    </h3>
  );
}

function computeSummary() {
  const {
    tradesById: rowsById,
    derivedByTradeId,
    tradesOrder: rowsOrder,
    schemasById: columnsById,
  } = useTradeStore.getState();

  const numericColumns = Object.values(columnsById).filter(
    (col) => col.semanticType !== SEMANTIC_TYPE.STRING,
  );

  const rows = rowsOrder.map((id) => rowsById[id]);

  const stats = {};
  numericColumns.forEach((col) => {
    stats[col.id] = {
      sum: 0,
      min: Infinity,
      max: -Infinity,
      count: 0,
    };
  });

  let wins = 0;
  let losses = 0;

  rowsOrder.forEach((rowId) => {
    const row = { ...rowsById[rowId], ...(derivedByTradeId[rowId] || {}) };

    numericColumns.forEach((col) => {
      const value = Number(row[col.id]);
      if (!Number.isFinite(value)) return;

      const s = stats[col.id];
      s.sum += value;
      s.min = Math.min(s.min, value);
      s.max = Math.max(s.max, value);
      s.count++;

      if (col.id === "pnl") {
        if (value > 0) wins++;
        if (value < 0) losses++;
      }
    });
  });

  const tradeCount = rows.length;
  const winRate = tradeCount > 0 ? Math.round((wins / tradeCount) * 100) : 0;

  const metrics = numericColumns.map((col) => {
    const s = stats[col.id];

    return {
      id: col.id,
      label: col.label,
      format: col.display?.format,
      sum: formatValue(s.sum, col.type, col.display),
      avg: s.count ? formatValue(s.sum / s.count, col.type, col.display) : "0",
      min: s.count ? formatValue(s.min, col.type, col.display) : "0",
      max: s.count ? formatValue(s.max, col.type, col.display) : "0",
    };
  });

  const totalPnl =
    formatValue(stats?.pnl?.sum, "number", {
      format: "CURRENCY_SIGNED",
      decimals: 2,
    }) ?? 0;

  const insights = [];
  if (winRate > 60) insights.push("Strong win rate this period");
  if (wins === 0 && losses > 0) insights.push("No profitable trades recorded");
  if (tradeCount === 0) insights.push("No trades available for summary");

  return {
    tradeCount,
    winRate,
    wins,
    losses,
    totalPnl,
    metrics,
    insights,
  };
}

export default function SummaryPopup() {
  const closePopup = useTableStore((s) => s.closePopup);

  const summary = computeSummary();

  return (
    <Popup open>
      <Popup.Container className="w-180! max-w-full">
        <Popup.Header title="Summary" onClose={closePopup} />

        <Popup.Body className="px-5 py-4 space-y-6">
          {/* KPIs */}
          <KpiGrid summary={summary} />

          <Divider />

          {/* METRIC TABLE */}
          <div className="space-y-2">
            <SectionTitle>Metric Statistics</SectionTitle>
            <MetricTableHeader />
            <div className="space-y-1">
              {summary.metrics.map((m) => (
                <MetricStatsRow key={m.id} metric={m} id={m.id} />
              ))}
            </div>
          </div>

          <Divider />

          {/* INSIGHTS */}
          <div className="space-y-2">
            <SectionTitle>Insights</SectionTitle>
            {summary.insights.length ? (
              <ul className="space-y-2">
                {summary.insights.map((i, idx) => (
                  <li
                    key={idx}
                    className="
        flex items-start gap-2
        rounded
        border border-(--border)
        bg-(--surface-muted)
        px-3 py-2
        text-sm
      "
                  >
                    <span className="mt-0.5 text-(--info)">•</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-(--muted)">
                No significant insights for this period.
              </p>
            )}
          </div>
        </Popup.Body>
        <div className="w-full h-3 border-t border-(--border)"></div>
      </Popup.Container>
    </Popup>
  );
}

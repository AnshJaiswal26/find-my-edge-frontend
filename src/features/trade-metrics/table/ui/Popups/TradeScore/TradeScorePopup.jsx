import { Popup } from "@shared/components/layout";
import { useTradeSetupStore, useTradeStore } from "@shared/stores";
import { useMemo } from "react";
import { computeTradeScore } from "@lib/analytics/trade_score";
import { useTableStore } from "../../../store";
import { TAG_CONFIG } from "./tagConfig";
import { FieldMatchRow } from "./FieldMatchRow";
import { RulesBar } from "./RulesBar";
import { ScoreRing } from "./ScoreRing";
import { ZoomableImage } from "./ZoomableImage";
import { EmptyState } from "@shared/components/ui";

export function TradeScorePopup() {
  const closePopup = useTableStore((s) => s.closePopup);
  const schemasById = useTradeStore((s) => s.schemasById);
  const rowId = useTableStore((s) => s.currentTradeId);
  const derived = useTradeStore((s) => s.derivedByTradeId[rowId]);
  const trade = useTradeStore((s) => s.tradesById[rowId]);
  const setup = useTradeSetupStore((s) => s.tradeSetupsById[trade?.setup]);

  const result = useMemo(() => {
    if (!trade || !setup) return null;
    return computeTradeScore(trade, derived, setup);
  }, [trade, derived, setup]);

  const fieldMatches = result ? Object.values(result.fieldMatches) : [];
  const matched = fieldMatches.filter((f) => f.match).length;
  const total = fieldMatches.length;

  return (
    <Popup.Container className="!max-w-[90vw]">
      <Popup.Header title="Trade Score" onClose={closePopup} />

      <Popup.Body className="!px-2 !py-0">
        {!result ? (
          <EmptyState text="No setup assigned to this trade." />
        ) : (
          <div className="flex flex-row min-h-0 h-full">
            <ZoomableImage src={setup.imageUrl} />
            {/* ── Left: score hero ── */}
            <div
              className="flex flex-col flex-3 items-center gap-5 p-3 shrink-0 w-[220px]"
              style={{
                background:
                  "linear-gradient(160deg, var(--surface-muted-soft) 0%, transparent 100%)",
                borderRight: "1px solid var(--border-muted)",
              }}
            >
              <ScoreRing score={result.score} tag={result.overallTag} />
              <RulesBar
                matched={matched}
                total={total}
                tag={result.overallTag}
              />

              {/* Quick match / miss tally */}
              <div className="flex gap-3 w-full pt-2">
                <div
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg"
                  style={{ background: TAG_CONFIG.EXCELLENT.bg }}
                >
                  <span
                    className="text-base font-bold tabular-nums leading-none"
                    style={{ color: TAG_CONFIG.EXCELLENT.color }}
                  >
                    {matched}
                  </span>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: TAG_CONFIG.EXCELLENT.color }}
                  >
                    Match
                  </span>
                </div>
                <div
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg"
                  style={{ background: TAG_CONFIG.BAD.bg }}
                >
                  <span
                    className="text-base font-bold tabular-nums leading-none"
                    style={{ color: TAG_CONFIG.BAD.color }}
                  >
                    {total - matched}
                  </span>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: TAG_CONFIG.BAD.color }}
                  >
                    Miss
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right: scrollable field breakdown ── */}
            <div className="flex flex-col flex-4 min-w-0 min-h-0 h-full">
              {/* Sticky header */}
              <div
                className="px-5 py-2 shrink-0"
                style={{ borderBottom: "1px solid var(--border-muted)" }}
              >
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--text-charts-muted)" }}
                >
                  Field Breakdown
                </span>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0 max-h-67.5">
                {fieldMatches.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {fieldMatches.map((m, i) => (
                      <FieldMatchRow
                        key={m.fieldId}
                        match={m}
                        index={i}
                        schemasById={schemasById}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No rules available" />
                )}
              </div>

              {/* Fade-out hint at bottom when overflowing */}
              {fieldMatches.length > 4 && (
                <div
                  className="h-6 shrink-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, var(--surface) 0%, transparent 100%)",
                    marginTop: -24,
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </Popup.Body>

      <Popup.Footer text={["Close"]} onCancel={closePopup} />
    </Popup.Container>
  );
}

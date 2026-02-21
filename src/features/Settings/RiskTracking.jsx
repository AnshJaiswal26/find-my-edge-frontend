import { Section } from "@shared/components/layout";
import { Button, Input } from "@shared/components/ui";

export function RiskTracking({
  riskPerTrade,
  setRiskPerTrade,
  isPortfolioRiskEnabled,
  setIsPortfolioRiskEnabled,
  portfolioRiskLimit,
  setPortfolioRiskLimit,
}) {
  return (
    <Section title="Risk Tracking">
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT — Per Trade Risk */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-(--border) bg-(--surface-muted) space-y-4">
            <h4 className="text-base font-semibold text-(--text)">
              Per Trade Risk Control
            </h4>

            <Input
              label="Risk Per Trade (%)"
              placeholder="e.g. 1.5"
              value={riskPerTrade}
              onCommit={(v) => setRiskPerTrade(v)}
              classNames={{ input: "max-w-full!" }}
              hint="Maximum percentage of capital you are willing to lose per trade"
            />

            <div className="text-sm text-(--text) bg-(--info-soft) p-3 rounded-lg">
              This helps enforce position sizing discipline and prevents
              oversized losses.
            </div>
          </div>
        </div>

        {/* RIGHT — Portfolio Protection */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-(--border) bg-(--surface-muted) space-y-4">
            <h4 className="text-base font-semibold text-(--text)">
              Portfolio Protection (Kill Switch)
            </h4>

            <Button.Toggle
              label="Enable Auto Kill Switch"
              hint="Automatically disable trading if portfolio drawdown exceeds limit"
              value={isPortfolioRiskEnabled}
              onChange={(v) => setIsPortfolioRiskEnabled(v)}
            />

            {isPortfolioRiskEnabled && (
              <Input
                label="Max Portfolio Drawdown (%)"
                placeholder="e.g. 5"
                value={portfolioRiskLimit}
                onCommit={(v) => setPortfolioRiskLimit(v)}
                classNames={{ input: "max-w-full!" }}
                hint="Trading will stop if losses exceed this percentage"
              />
            )}

            {!isPortfolioRiskEnabled && (
              <div className="text-sm text-(--text) bg-(--warning-soft) p-3 rounded-lg">
                Kill switch is disabled. Your system will not auto-protect
                capital from large drawdowns.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY BAR */}
      <div className="mt-8 p-4 rounded-xl bg-(--surface-muted) border-(--border) border flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-(--text-muted)">Risk Per Trade:</span>{" "}
          <span className="font-semibold text-(--text)">
            {riskPerTrade ? `${riskPerTrade}%` : "Not Set"}
          </span>
        </div>

        <div>
          <span className="text-(--text-muted)">Portfolio Protection:</span>{" "}
          <span
            className={`font-semibold ${
              isPortfolioRiskEnabled ? "text-(--success)" : "text-(--error)"
            }`}
          >
            {isPortfolioRiskEnabled
              ? `${portfolioRiskLimit || "Not Set"}% Max Drawdown`
              : "Disabled"}
          </span>
        </div>
      </div>
    </Section>
  );
}

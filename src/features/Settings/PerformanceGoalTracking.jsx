import { Section } from "@layout";
import { Input } from "@ui";

export function PerformaceGoalTracking({
  dayProfitTarget,
  setDayProfitTarget,
  maxLossTolerance,
  setMaxLossTolerance,
  resetGoals,
}) {
  return (
    <Section title="Performance Goal Tracking">
      <div className="grid md:grid-cols-2 gap-8">
        {/* 🎯 Profit Target Card */}
        <div className="p-5 rounded-xl border border-(--border) bg-(--surface-light) space-y-4">
          <h4 className="text-base font-semibold text-(--text)">
            Daily Profit Target
          </h4>

          <Input
            label="Target (% or Amount)"
            placeholder="e.g. 2 or 5000"
            value={dayProfitTarget}
            onCommit={(v) => setDayProfitTarget(v)}
            classNames={{ input: "max-w-full!" }}
            hint="Trading day is considered successful once this goal is reached"
          />

          <div className="text-sm bg-(--success-soft) text-(--text) p-3 rounded-lg">
            Helps you lock in gains and avoid overtrading after hitting your
            goal.
          </div>
        </div>

        {/* 🛑 Loss Limit Card */}
        <div className="p-5 rounded-xl border-(--border) border bg-(--surface-light) space-y-4">
          <h4 className="text-base font-semibold text-(--text)">
            Maximum Daily Loss
          </h4>

          <Input
            label="Limit (% or Amount)"
            placeholder="e.g. 1 or 3000"
            value={maxLossTolerance}
            onCommit={(v) => setMaxLossTolerance(v)}
            classNames={{ input: "max-w-full!" }}
            hint="Trading will stop once this loss is reached"
          />

          <div className="text-sm bg-(--error-soft) text-(--text) p-3 rounded-lg">
            Protects your capital from emotional or revenge trading.
          </div>
        </div>
      </div>

      {/* 📊 Summary Strip */}
      <div className="mt-8 p-4 rounded-xl bg-(--surface-muted) border-(--border) border flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-(--text-muted)">Daily Profit Target:</span>{" "}
          <span className="font-semibold text-(--success)">
            {dayProfitTarget || "Not Set"}
          </span>
        </div>

        <div>
          <span className="text-(--text-muted)">Max Daily Loss:</span>{" "}
          <span className="font-semibold text-(--error)">
            {maxLossTolerance || "Not Set"}
          </span>
        </div>
      </div>

      {/* 🔄 Reset Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={resetGoals}
          className="px-5 py-2 rounded-lg border text-sm font-medium
                 text-(--text-muted) border-[var(--border)]
                 hover:bg-[var(--hover)] transition"
        >
          Reset Goals
        </button>
      </div>
    </Section>
  );
}

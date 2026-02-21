import { Section } from "@shared/components/layout";
import { useUIStore } from "@shared/stores";

const THEMES = [
  {
    id: "light-1",
    label: "Light Default",
    color: "#ffffff",
    accent: "#3b82f6",
  },
  { id: "light-2", label: "Soft Blue", color: "#f0f6ff", accent: "#3b82f6" },
  { id: "light-3", label: "Warm Beige", color: "#f7f3ed", accent: "#d97706" },
  { id: "light-4", label: "Mint Green", color: "#eefaf3", accent: "#10b981" },
  { id: "dark-1", label: "Dark Default", color: "#0f172a", accent: "#3b82f6" },
  { id: "dark-2", label: "Deep Blue", color: "#111827", accent: "#60a5fa" },
  { id: "dark-3", label: "AMOLED", color: "#050505", accent: "#a3a3a3" },
  { id: "dark-4", label: "Purple Dark", color: "#1e1b2e", accent: "#a78bfa" },
];

export function ThemeSettings() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <Section title="Themes" className={"max-w-150 w-150 self-center"}>
      <div className="grid grid-cols-2 gap-4 p-3">
        {THEMES.map((t) => {
          const isActive = theme === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`
                relative p-4 rounded-xl border transition-all text-left
                flex items-center justify-between
                ${
                  isActive
                    ? "border-(--info) shadow-(--shadow-hover)"
                    : "border-(--border)"
                }
              `}
            >
              {/* COLOR PREVIEW */}

              {/* LABEL */}
              <div className="font-semibold text-(--text)">{t.label}</div>

              {/* ACTIVE INDICATOR */}
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-(--info)" />
              )}

              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: t.accent }}
                />
                <div
                  className="w-6 h-6 rounded-md border border-(--border)"
                  style={{ background: t.color }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

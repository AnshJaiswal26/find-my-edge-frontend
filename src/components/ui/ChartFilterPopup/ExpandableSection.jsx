import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./ChartFilterPopup.module.css";
import { useState } from "react";

export default function ExpandableSection({
  title,
  values,
  options,
  selected,
  onSelect,
  onChange,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isBetween = selected === "isBetween" || selected === "isNotBetween";
  const key = isBetween ? "from" : "value";

  return (
    <>
      <button
        className={`border-t-1 pt-2 border-[var(--color-bg-hover)] ${styles.filterButton}`}
        onClick={() => setIsExpanded((p) => !p)}
      >
        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        <span>{title}</span>
      </button>

      {isExpanded && (
        <div className="pl-3 pr-3 w-[100%] flex flex-col gap-3.5">
          <select
            onChange={(e) => onSelect(e.target.value)}
            className={styles.chartFilterSelect}
            value={selected}
            id={title}
          >
            {Array.isArray(options)
              ? options.map((v, i) => <option key={i}>{v}</option>)
              : Object.entries(options).map(([k, v], i) => (
                  <option key={i} value={k}>
                    {v}
                  </option>
                ))}
          </select>

          {title.includes("Filter") && selected !== "none" && (
            <div className="flex flex-col gap-2">
              <input
                className={styles.chartFilterInput}
                value={values[key]}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={
                  selected.includes("date")
                    ? "YYYY-MM-DD"
                    : "Enter Value for Filter"
                }
              />
              {isBetween && (
                <>
                  <span>and</span>
                  <input
                    className={styles.chartFilterInput}
                    placeholder="Enter Value for Filter"
                    value={values.to}
                    onChange={(e) => onChange("to", e.target.value)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./FilterPopup.module.css";
import { useState } from "react";
import { Select } from "@ui";

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
        className={`border-t-1 ${
          isExpanded ? "" : "border-b-1"
        } pt-2 border-[var(--hover)] ${styles.filterButton}`}
        onClick={() => setIsExpanded((p) => !p)}
      >
        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        <span>{title}</span>
      </button>

      {isExpanded && (
        <div className="pl-3 pr-3 w-[100%] flex flex-col gap-3.5">
          <Select
            onChange={(v) => onSelect(v)}
            value={selected}
            options={options}
          />

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

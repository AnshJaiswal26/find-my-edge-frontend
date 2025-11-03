import { useClickOutside, useResolvedValue } from "@hooks";
import styles from "./Select.module.css";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
export default function Select({
  label,
  options,
  value,
  onChange = () => null,
  store,
}) {
  const btnRef = useRef(null);

  const val = useResolvedValue(store, value);
  const [showList, setShowList] = useState(false);

  useClickOutside(btnRef, () => setShowList(false));

  return (
    <div className={styles.selectWrapper}>
      <div className="flex gap-1">
        <span className={styles.selectLabel}>{label}</span>
      </div>
      <div className={styles.optionListWrapper} ref={btnRef}>
        <button
          className={styles.selectBtn}
          onClick={() => setShowList((p) => !p)}
        >
          <span>{val}</span>{" "}
          {showList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showList && (
          <div className={styles.optionList}>
            {options.map((o, i) => (
              <button
                key={i}
                className={`${styles.option} ${o === val ? styles.active : ""}`}
                onClick={() => {
                  onChange(o);
                  setShowList(false);
                }}
              >
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

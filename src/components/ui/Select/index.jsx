import { useResolvedValue } from "@hooks";
import styles from "./Select.module.css";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createPortal } from "react-dom";
export default function Select({
  label,
  options,
  value,
  onChange = () => null,
  store,
  className,
}) {
  const listRef = useRef(null);
  const buttonRef = useRef(null);

  const val = useResolvedValue(store, value);

  const [showList, setShowList] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const isArray = Array.isArray(options);

  useEffect(() => {
    if (showList && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    const handleGlobalClose = (e) => {
      // If dropdown isn’t open → skip
      if (!showList) return;

      // If click was inside button or list → ignore
      if (
        buttonRef.current?.contains(e.target) ||
        listRef.current?.contains(e.target)
      )
        return;

      setShowList(false);
    };

    // Close on blur (when switching tabs or focusing DevTools)
    const handleBlur = () => setShowList(false);

    window.addEventListener("mousedown", handleGlobalClose);
    window.addEventListener("resize", handleBlur);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleBlur);

    return () => {
      window.removeEventListener("mousedown", handleGlobalClose);
      window.removeEventListener("resize", handleBlur);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleBlur);
    };
  }, [showList]);

  return (
    <div className={`${styles.selectWrapper} ${className}`}>
      {label && (
        <div className="flex gap-1">
          <span className={styles.selectLabel}>{label}</span>
        </div>
      )}
      <div className={`${styles.optionListWrapper} ${label ? "" : "w-full"}`}>
        <button
          ref={buttonRef}
          className={styles.selectBtn}
          onClick={() => setShowList((p) => !p)}
        >
          <span>{isArray ? val : options[val]}</span>{" "}
          {showList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showList &&
          createPortal(
            <div
              ref={listRef}
              className={styles.optionList}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 9999,
              }}
            >
              {(isArray ? options : Object.keys(options)).map((o, i) => (
                <button
                  key={i}
                  className={`${styles.option} ${
                    o === val ? styles.active : ""
                  }`}
                  onClick={() => {
                    onChange(o, options[o]);
                    setShowList(false);
                  }}
                >
                  {isArray ? o : options[o]}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}

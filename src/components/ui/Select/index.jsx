import { useResolvedValue } from "@hooks";
import styles from "./Select.module.css";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createPortal } from "react-dom";
import { useUIStore } from "@stores";
export default function Select({
  label,
  options,
  value,
  onChange = () => null,
  store,
  className,
}) {
  const listId = useId();
  const buttonId = `${listId}-button`;

  const buttonRef = useRef(null);

  const val = useResolvedValue(store, value);

  const activeSelector = useUIStore((s) => s.activeSelector);
  const toggleActiveSelector = useUIStore((s) => s.toggleActiveSelector);

  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const isArray = Array.isArray(options);

  useEffect(() => {
    if (activeSelector?.listId === listId && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [activeSelector]);

  return (
    <div className={`${styles.selectWrapper} ${className}`}>
      {label && (
        <div className="flex gap-1">
          <span className={styles.selectLabel}>{label}</span>
        </div>
      )}
      <div className={`${styles.optionListWrapper} ${label ? "" : "w-full"}`}>
        <button
          id={buttonId}
          ref={buttonRef}
          className={styles.selectBtn}
          onClick={(e) => {
            e.preventDefault();
            toggleActiveSelector(listId, buttonId);
          }}
        >
          <span>{isArray ? val : options[val]}</span>{" "}
          {activeSelector?.listId == listId ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>

        {activeSelector?.listId == listId &&
          createPortal(
            <div
              id={listId}
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
                  id={listId}
                  key={i}
                  className={`${styles.option} ${
                    o === val ? styles.active : ""
                  }`}
                  onClick={() => {
                    onChange(o, options[o]);
                    toggleActiveSelector(listId, buttonId);
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

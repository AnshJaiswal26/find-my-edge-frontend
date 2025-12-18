import { useResolvedValue } from "@hooks";
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
  className = "",
  buttonClass = "",
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
    <div
      className={`
        flex items-center justify-between flex-wrap
        text-sm
        ${className}
      `}
    >
      {label && (
        <div className="flex gap-1">
          <span className="text-(--text-primary)">{label}</span>
        </div>
      )}

      <div className={`relative ${label ? "" : "w-full"}`}>
        <button
          id={buttonId}
          ref={buttonRef}
          className={`
            flex items-center justify-between gap-1
            px-2.5 py-1.5
            rounded
            border border-(--border)
            min-w-25 w-full
            box-border
            ${buttonClass}
          `}
          onClick={(e) => {
            e.preventDefault();
            toggleActiveSelector(listId, buttonId);
          }}
        >
          <span>{isArray ? val : options[val]}</span>

          {activeSelector?.listId === listId ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>

        {activeSelector?.listId === listId &&
          createPortal(
            <div
              id={listId}
              className="
                absolute
                flex flex-col
                rounded-tl rounded-bl
                border border-(--border)
                bg-(--surface-muted)
                text-(--text)
                text-sm
                max-h-100
                min-w-25
                overflow-y-auto
                box-border
                z-100001
              "
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}
            >
              {(isArray ? options : Object.keys(options)).map((o, i) => (
                <button
                  key={i}
                  id={listId}
                  className={`
                    text-left
                    px-2 py-1
                    border-b border-(--hover)
                    last:border-b-0
                    hover:bg-(--hover)
                    ${o === val ? "bg-(--hover)" : ""}
                  `}
                  onClick={() => {
                    onChange(o, options[o]);
                    console.log("clicked");
                    toggleActiveSelector(listId, buttonId);
                  }}
                >
                  {isArray ? o : options[o]}
                </button>
              ))}
            </div>,
            document.getElementById("root")
          )}
      </div>
    </div>
  );
}

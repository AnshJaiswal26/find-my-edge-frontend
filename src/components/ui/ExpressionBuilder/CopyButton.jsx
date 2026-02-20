import { useState } from "react";

export const CopyButton = ({ labelExpr }) => {
  const [copy, setCopy] = useState(false);

  return (
    <div
      className={`absolute top-1 right-3 text-(--text-muted) rounded py-1 px-2 hover:bg-(--hover) cursor-pointer select-none z-200 ${copy ? "pointer-events-none" : ""}`}
      onClick={() => {
        setCopy(true);
        navigator.clipboard.writeText(labelExpr);
        setTimeout(() => setCopy(false), 2000);
      }}
    >
      <span>{copy ? "✓" : ""} Copy </span>
    </div>
  );
};

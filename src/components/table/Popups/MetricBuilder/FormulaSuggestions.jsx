import React from "react";

export function FormulaSuggestions({ suggestions, highlight, onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div className="absolute bottom-full z-20 w-full bg-(--surface-muted) border border-(--text) rounded shadow">
      {suggestions.map((c, i) => (
        <div
          key={c.id}
          onMouseDown={() => onSelect(c.label)}
          className={`px-3 py-2 cursor-pointer ${
            i === highlight ? "bg-(--info)" : ""
          }`}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

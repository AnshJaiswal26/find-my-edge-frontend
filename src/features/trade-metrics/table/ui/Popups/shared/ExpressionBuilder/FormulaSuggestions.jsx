export function FormulaSuggestions({ suggestions, highlight, onSelect }) {
  return (
    <div className="absolute bottom-full z-20 bg-(--surface) border rounded shadow">
      {suggestions.map((s, i) => (
        <div
          key={i}
          onMouseDown={() => onSelect(s)}
          className={`px-2 py-1 flex gap-2 items-center cursor-pointer
            ${i === highlight ? "bg-(--hover)" : ""}`}
        >
          {s.type === "function" && (
            <>
              <span className="text-xs opacity-70">ƒ</span>
              <span className="font-mono">{s.signature}</span>
            </>
          )}

          {s.type === "column" && (
            <>
              <span className="text-xs opacity-50">▦</span>
              <span>{s.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

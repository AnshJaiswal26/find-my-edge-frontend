export function FormulaSuggestions({ suggestions, highlight, onSelect }) {
  return (
    <div className="absolute bottom-full z-20 bg-(--surface) border rounded shadow overflow-auto max-h-63">
      {suggestions.map((s, i) => (
        <div
          key={i}
          onMouseDown={() => onSelect(s)}
          className={`px-2 py-1 flex gap-2 items-center cursor-pointer
            ${i === highlight ? "bg-(--hover)" : ""}`}
        >
          <span className="text-xs opacity-70">
            {s.type === "function" ? "ƒ" : "▦"}
          </span>
          <div className="flex font-mono whitespace-pre">
            <span>{s.highlight.before}</span>
            <span className="text-(--success)">{s.highlight.match}</span>
            <span>{s.highlight.after}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

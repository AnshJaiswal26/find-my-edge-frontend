export function FormulaSuggestions({ suggestions, highlight, onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div className="absolute bottom-full z-20 w-[50%] bg-(--surface-muted) border border-(--text) rounded shadow">
      {suggestions.map((c, i) => (
        <div
          key={c.id}
          onMouseDown={() => onSelect(c.label)}
          className={`px-2 py-1 cursor-pointer ${
            i === highlight ? "bg-(--info)" : ""
          }`}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

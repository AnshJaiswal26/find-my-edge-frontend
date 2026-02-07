export const Card = ({ label, value, positive }) => (
  <div className="flex flex-col max-w-40 min-w-28 text-sm px-4 py-3 rounded bg-(--surface-muted) border border-(--border) shadow-lg">
    <span className="text-(--text-muted)">{label}</span>
    <span
      className={`font-semibold ${
        positive == null
          ? "text-(--text)"
          : positive
            ? "text-(--success)"
            : "text-(--error)"
      }`}
    >
      {value}
    </span>
  </div>
);

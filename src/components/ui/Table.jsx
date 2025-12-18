export default function Table({ tableHead, tableBody }) {
  const flatTable = tableBody.flatMap((list) => list);
  const colLength = tableHead.length;

  return (
    <div
      className="
        w-full h-full
        max-w-300 max-h-107.5
        overflow-x-auto
      "
    >
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${colLength}, minmax(150px, 1fr))`,
        }}
      >
        {/* Header */}
        {tableHead.map((cell, index) => (
          <div
            key={index}
            className="
              sticky top-0
              bg-(--surface-muted)
              p-2
              border border-(--border-muted)
              font-medium
            "
          >
            <span>{cell}</span>
          </div>
        ))}

        {/* Body */}
        {flatTable.map((cell, index) => (
          <div
            key={index}
            className="
              p-2
              border border-(--border-muted)
            "
          >
            <span>{cell}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

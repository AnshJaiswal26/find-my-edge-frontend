export default function Bar({ color, labels, fill }) {
  return (
    <div className="w-full min-w-[180px] box-border">
      <div className="flex flex-wrap justify-between items-center w-full text-sm mb-2 text-(--text-charts)">
        {labels &&
          labels.map((label) => (
            <div>
              <span>{label}</span>
            </div>
          ))}
      </div>

      <div className="flex-1 h-[14px] bg-(--hover) overflow-hidden relative rounded-[6px]">
        <div
          className="h-full"
          style={{
            width: fill,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default function ButtonSelector({
  label,
  options,
  selectedOption,
  onSelect,
  size = "medium",
  track = true,
  fieldFormatter,
}) {
  const sizeClasses = {
    small: "px-2 py-1 text-[0.776rem] rounded-[0.2rem]",
    medium: "px-3 py-2 text-sm rounded",
  };

  const renderButtons = () =>
    options.map((mode) => {
      const isSelected = selectedOption === mode;

      return (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          className={`
            flex-1 min-w-[70px]
            ${sizeClasses[size]}
            transition-colors duration-200
            cursor-pointer
            ${
              isSelected
                ? "bg-blue-600 text-white shadow"
                : "text-(--text-muted) hover:bg-(--hover)"
            }
          `}
        >
          {fieldFormatter ? fieldFormatter[mode] : mode}
        </button>
      );
    });

  return track ? (
    <div>
      {label && <div className="text-sm mb-[7px] text-(--text)">{label}</div>}

      <div className="flex gap-1 bg-(--hover) rounded-md p-1 mb-2">
        {renderButtons()}
      </div>
    </div>
  ) : (
    <>{renderButtons()}</>
  );
}

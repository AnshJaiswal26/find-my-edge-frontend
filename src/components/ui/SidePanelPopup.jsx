export default function SidePanelPopup({
  listClassName = "",
  items = [],
  activeIndex,
  onSelectIndex,
  getLabel = (item, index) => item,
  getKey = (item, index) => index,
  getSection = (index) => null,
  renderDetails,
}) {
  return (
    <div className={`flex h-full`}>
      {/* LEFT */}
      <div
        className={`w-33 border-r border-(--border) overflow-auto ${listClassName}`}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const section = getSection(index);
          return (
            <div key={index}>
              {section && (
                <div className="px-3 uppercase w-full border-(--border) mt-1 -mb-0.5">
                  <span className="text-[0.6rem] text-(--text-muted) ">
                    {section}
                  </span>
                </div>
              )}
              <div
                key={getKey(item, index)}
                onClick={() => onSelectIndex(index)}
                className={`px-3 py-2  text-sm cursor-pointer ${isActive ? "bg-(--hover)" : ""}`}
              >
                {getLabel(item, index)}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="flex-1 p-3 overflow-auto">
        {renderDetails(items[activeIndex], activeIndex)}
      </div>
    </div>
  );
}

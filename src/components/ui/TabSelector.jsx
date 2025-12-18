export default function TabContainer({
  tabs,
  currentTab,
  onClick,
  tabStyle,
  style,
}) {
  return (
    <div
      style={tabStyle}
      className="
        relative flex w-full
        overflow-x-auto
        text-base
        text-(--text-muted)
        border-b border-(--border)
        mb-2.5
      "
    >
      {tabs.map(({ key, label }) => (
        <div
          key={key}
          style={style}
          onClick={() => onClick(key)}
          className={`
            px-2.5 py-2.5
            cursor-pointer
            whitespace-nowrap

            ${
              currentTab === key
                ? `
                  bg-(--info-soft)
                  text-(--text)
                  border-b-2 border-(--info)
                `
                : ""
            }
          `}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

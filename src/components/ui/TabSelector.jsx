import { useEffect, useRef, useState } from "react";

export default function TabContainer({
  tabs,
  currentTab,
  onClick,
  tabStyle,
  style,
}) {
  const containerRef = useRef(null);
  const tabRefs = useRef({});

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  // Update indicator position
  useEffect(() => {
    const activeTab = tabRefs.current[currentTab];
    const container = containerRef.current;

    if (activeTab && container) {
      const { offsetLeft, offsetWidth } = activeTab;

      setIndicator({
        left: offsetLeft - 10,
        width: offsetWidth + 20,
      });
    }
  }, [currentTab, tabs]);

  return (
    <div
      ref={containerRef}
      style={tabStyle}
      className="px-2.5
        relative flex w-full gap-4.5
        overflow-x-auto
        text-base
        text-(--text-muted)
        border-b border-(--border)
        mb-2.5
      "
    >
      {/* 🔥 Sliding Indicator */}
      <div
        className="
          absolute bottom-0 h-[2px]
          bg-(--text)
          transition-all duration-300 ease-in-out
          z-2
        "
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />
      <div
        className="bg-[color-mix(in_srgb,var(--surface-disabled)_95%,transparent)] 
        absolute h-full z-1
        transition-all duration-300 ease-in-out"
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />

      {tabs.map(({ key, label }) => (
        <div
          key={key}
          ref={(el) => (tabRefs.current[key] = el)}
          style={style}
          onClick={() => onClick(key)}
          className={`
            py-2.5
            cursor-pointer
            whitespace-nowrap
            transition-colors duration-200
            z-2
            ${currentTab === key ? "text-(--text)" : "hover:text-(--text)"}
          `}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

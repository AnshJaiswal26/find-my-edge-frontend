const PopupSummary = () => {
  return (
    <div className="bg-(--surface-muted) rounded-[10px] text-(--text-muted) shadow-md p-5 min-w-[360px]">
      <h3 className="text-[20px] font-bold text-(--text) mb-1">
        Net Realised P&L
      </h3>

      <span className="block text-[28px] font-bold text-(--error)">
        ₹-3,357.77
      </span>
      <span className="text-sm">for Oct 2024</span>

      <div className="flex justify-between py-[13px] mt-3 border-y border-[#f0e6e6]">
        {[
          ["22", "Trading Days", "var(--cyan)"],
          ["6", "Traded On", "var(--warning)"],
          ["0", "In-Profit Days", "var(--success)"],
          ["0", "Winning Streak", "var(--info)"],
        ].map(([v, l, c]) => (
          <div
            key={l}
            className="flex-1 text-center border-r last:border-r-0 border-[#f0e6e6]"
          >
            <p className="text-[20px] font-bold" style={{ color: c }}>
              {v}
            </p>
            <p className="text-[14px]">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopupSummary;

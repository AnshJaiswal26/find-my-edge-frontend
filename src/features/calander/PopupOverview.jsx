import { Container } from "@layout";

const PopupOverview = () => {
  return (
    <Container childClassName="gap-2! text-(--text-muted)">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[18px] font-bold">Oct 23, 2024</span>
        <span className="text-[18px] font-bold text-(--error)">₹-1,059.75</span>
      </div>

      <div className="flex items-center gap-1 mb-2">
        <img
          src="Icons/others/trading.png"
          alt=""
          className="w-[30px] h-[30px]"
        />
        <h4 className="text-[16px] font-bold">Trade Overview</h4>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-[14px] my-[5px]">
            <strong>Overall P&L:</strong>{" "}
            <span className="text-(--error)">₹-1,059.75</span>
          </p>
          <p className="text-[14px] my-[5px]">
            <strong>Govt Charges:</strong> ₹22.45
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-[14px] my-[5px]">
            <strong>Net P&L:</strong>{" "}
            <span className="text-(--error)">₹-1,162.20</span>
          </p>
          <p className="text-[14px] my-[5px]">
            <strong>Brokerage:</strong> ₹80.00
          </p>
        </div>

        <div className="flex items-end">
          <p className="text-[14px] my-[5px]">
            <strong>Trades:</strong> 4
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[15px] pt-[10px] border-t border-[#f0e6e6]">
        <p className="text-[12px] text-[#999]">
          See trades for this period with your trading details.
        </p>
        <button className="bg-(--warning) text-white font-bold text-[14px] px-3 py-2 rounded-md transition-colors">
          View
        </button>
      </div>
    </Container>
  );
};

export default PopupOverview;

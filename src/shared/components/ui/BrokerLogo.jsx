import { Brokers } from "@features/integrations/brokers/config";

export default function BrokerLogo({ imgSrc }) {
  return (
    <div className="justify-self-center mb-4 p-4">
      <div className="w-25 h-25 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center border-white border-10 shadow-lg">
        <img
          src={imgSrc || Brokers.DHAN.logo}
          alt="Dhan Logo"
          className="!w-24 !h-24 object-cover"
        />
      </div>
    </div>
  );
}

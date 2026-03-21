import { BROKERS } from "@features/integrations/brokers/config";

export default function BrokerLogo({ imgSrc, zoom = "lg" }) {
  return (
    <div className="justify-self-center mb-4 p-4">
      <div className="w-25 h-25 rounded-full overflow-hidden bg-white flex items-center justify-center border-white border-10 shadow-lg">
        <img
          src={imgSrc || BROKERS.DHAN.logo}
          alt="Dhan Logo"
          className={`${zoom == "lg" ? "!w-24 !h-24" : "!w-18 !h-18"} object-cover`}
        />
      </div>
    </div>
  );
}

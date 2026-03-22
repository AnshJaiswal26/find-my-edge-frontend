import { Container } from "@shared/components/layout";

import {
  Toolbar,
  TradeSetupTable,
} from "@features/setups-rules/components/table";
import { SetupImage } from "./SetupImage";

export function TradeSetup({ id }) {
  return (
    <Container className="md:!h-100 !h-150 !pt-3">
      <Toolbar id={id} />
      <div className="flex flex-wrap md:flex-row flex-col gap-3 justify-between h-full overflow-x-auto">
        <SetupImage id={id} />
        <TradeSetupTable id={id} />
      </div>
    </Container>
  );
}

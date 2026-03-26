import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";
import { bootstrapService } from "@shared/services/bootstrap.service";
import { useTradeStore } from "@shared/stores/useTradeStore";
import { useTradeSetupStore } from "@shared/stores";

export async function appBootstrap() {
  const data = await bootstrapService.init();

  console.log("Bootstrap res", data);

  useTradeStore.setState({
    tradesById: data.tradesById,
    derivedByTradeId: data.derivedByTradeId,
    tradesOrder: data.tradesOrder,
  });

  useTradeStore.setState({
    schemasById: data.schemasById,
    schemasOrder: data.schemasOrder,
    affectedMap: buildSchemasAffectedMap(data.schemasById, data.schemasOrder),
  });

  useTradeSetupStore.setState({
    tradeSetupsOrder: data.tradeSetupsOrder,
    tradeSetupsById: data.tradeSetupsById,
  });
}

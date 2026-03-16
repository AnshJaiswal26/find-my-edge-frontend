import { buildSchemasAffectedMap } from "@lib/analytics/schema/dependency";
import { bootstrapService } from "@shared/services/bootstrap.service";
import { useTradeStore } from "@shared/stores/useTradeStore";

export async function appBootstrap() {
  const data = await bootstrapService.init();

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
}

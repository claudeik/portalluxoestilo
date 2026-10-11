// apps/api/src/queues/index.ts
// Workers BullMQ operacionais (§22.5) + analíticos Postgres-as-Lake (§28.5)

import { Queue } from "bullmq";
import { redis } from "../lib/redis.js";
import { logger } from "../lib/logger.js";

export const syncCatalogQueue = new Queue("sync-catalog", { connection: redis });
export const syncStockQueue = new Queue("sync-stock", { connection: redis });
export const syncTrackingQueue = new Queue("sync-tracking", { connection: redis });
export const erpSyncQueue = new Queue("erp-sync", { connection: redis });

// Queues analíticas (ADR-0009 · Spec §28.5)
export const anomalyDetectionQueue = new Queue("ml-anomaly-detection", { connection: redis });
export const productEmbeddingsQueue = new Queue("ml-product-embeddings", { connection: redis });
export const demandForecastQueue = new Queue("ml-demand-forecast", { connection: redis });
export const analyticsRefreshQueue = new Queue("analytics-refresh", { connection: redis });

export function registerBackgroundQueues() {
  logger.info(
    {
      operationalQueues: ["sync-catalog (6h)", "sync-stock (4h)", "sync-tracking (4h)", "erp-sync (on PAID)"],
      analyticsQueues: [
        "ml-anomaly-detection (dom 02h)",
        "ml-product-embeddings (diário 03h)",
        "ml-demand-forecast (mensal 1ª seg)",
        "analytics-refresh (diário 01h)",
      ],
    },
    "BullMQ queues configuradas"
  );
}

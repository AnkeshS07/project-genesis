import type { AppLogger } from '../logging/app-logger.service';
import type { MetricsPort } from '../metrics/metrics.interface';
import { INFRA_METRIC_NAMES } from '../telemetry.constants';

let registered = false;
let uncaughtHandler: ((error: Error) => void) | undefined;
let rejectionHandler: ((reason: unknown) => void) | undefined;

/**
 * Registers process-level error hooks once per process.
 * Call {@link unregisterProcessErrorHandlers} during graceful shutdown.
 */
export function registerProcessErrorHandlers(logger: AppLogger, metrics: MetricsPort): void {
  if (registered) {
    return;
  }
  registered = true;

  uncaughtHandler = (error: Error): void => {
    metrics.increment(INFRA_METRIC_NAMES.PROCESS_UNHANDLED_EXCEPTIONS_TOTAL, 1, {
      type: error.name,
    });
    logger.error('Unhandled exception', { type: error.name }, error);
  };

  rejectionHandler = (reason: unknown): void => {
    metrics.increment(INFRA_METRIC_NAMES.PROCESS_UNHANDLED_REJECTIONS_TOTAL, 1, {
      type: reason instanceof Error ? reason.name : 'unknown',
    });
    logger.error(
      'Unhandled promise rejection',
      { type: reason instanceof Error ? reason.name : typeof reason },
      reason,
    );
  };

  process.on('uncaughtException', uncaughtHandler);
  process.on('unhandledRejection', rejectionHandler);
}

/**
 * Detaches process error listeners registered by this module.
 * Safe to call multiple times.
 */
export function unregisterProcessErrorHandlers(): void {
  if (!registered) {
    return;
  }
  if (uncaughtHandler) {
    process.off('uncaughtException', uncaughtHandler);
  }
  if (rejectionHandler) {
    process.off('unhandledRejection', rejectionHandler);
  }
  uncaughtHandler = undefined;
  rejectionHandler = undefined;
  registered = false;
}

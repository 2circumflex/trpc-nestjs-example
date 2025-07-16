import { TRPCMiddleware, MiddlewareOptions } from "nestjs-trpc";
import { Inject, Injectable, ConsoleLogger } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements TRPCMiddleware {
  constructor(
    @Inject(ConsoleLogger) private readonly consoleLogger: ConsoleLogger
  ) {}

  async use(opts: MiddlewareOptions) {
    const start = Date.now();
    const { next, path, type } = opts;
    const result = await next();

    const durationMs = Date.now() - start;
    const meta = { path, type, durationMs };

    if (result.ok) {
      this.consoleLogger.log(`[tRPC] ${type} ${path} - ${durationMs}ms`, meta);
    } else {
      this.consoleLogger.error(
        `[tRPC] Error in ${type} ${path} - ${durationMs}ms`,
        meta
      );
    }

    return result;
  }
}

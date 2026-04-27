import pino from "pino";
import { env } from "../../config/env";

const isDevelopment = env.NODE_ENV !== "production";

export const logger = pino(
  isDevelopment
    ? {
        level: "info",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {
        level: "info",
      },
);

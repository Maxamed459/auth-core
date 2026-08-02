import * as fs from "node:fs";
import * as path from "node:path";
import * as winston from "winston";
import { LOG_LEVEL, NODE_ENV } from "./dotenv.js";

const isProduction = NODE_ENV === "production";
const level = LOG_LEVEL ?? (isProduction ? "info" : "debug");
const logsDir = path.resolve(process.cwd(), "logs");

if (isProduction && !fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level: logLevel, message, ...meta }) => {
    const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${logLevel}] ${message}${metadata}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const loggerTransports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction ? prodFormat : devFormat,
  }),
];

if (isProduction) {
  loggerTransports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: prodFormat,
    }),
  );
  loggerTransports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: prodFormat,
    }),
  );
}

export const logger = winston.createLogger({
  level,
  transports: loggerTransports,
  exitOnError: false,
});

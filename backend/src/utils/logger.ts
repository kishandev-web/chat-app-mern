import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// 🔹 Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// 🔹 Logger instance
export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json(),
  ),
  transports: [
    // Save errors in file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Save all logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

//  Console logging (only in development)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  );
}

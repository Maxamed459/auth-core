import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Request, Response } from "express";
import { PORT } from "./config/dotenv.js";
import { connectDb } from "./config/db.js";
import { logger } from "./config/logger.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  return res.status(200).json({
    success: "true",
    message: "api health is good",
  });
});

await connectDb();
app.listen(PORT, () => {
  logger.info(`server is runnig on http://localhost:${PORT}`);
});

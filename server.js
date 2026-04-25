import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.js";
import routes from "./routes/userLocationRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";
import requestMetrics from "./src/middleware/requestMetrics.js";
import { getMetrics, metricsContentType } from "./src/monitoring/prometheus.js";
import { logger } from "./src/utils/logger.js";

const app = express();
app.use(cors());
app.use(requestMetrics);

// Middleware
app.use(express.json());

app.get("/metrics", async (req, res, next) => {
  try {
    res.set("Content-Type", metricsContentType);
    res.end(await getMetrics());
  } catch (err) {
    next(err);
  }
});
// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/user-settings", routes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Start server AFTER DB connection
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info("preferences_api_started", { port: PORT, metrics: "/metrics" });
    console.log(`🔥 Server running on port ${PORT}`);
    console.log(`📖 API docs available at http://localhost:${PORT}/api-docs`);
  });
});
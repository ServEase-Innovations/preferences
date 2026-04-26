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
// Identify this service in every response (helps if another process was bound to the same port)
app.use((req, res, next) => {
  res.setHeader("X-ServeEaso-Service", "preferences");
  next();
});
app.use(requestMetrics);

// Middleware
app.use(express.json());

// Public: no auth — if you get JSON 401 with messageId "auth.*", you are not talking to this app
// (try: curl -sI http://localhost:3001/_whoami  → should show X-ServeEaso-Service: preferences)
app.get("/_whoami", (req, res) => {
  res.json({ service: "preferences", role: "user-settings-api", ok: true });
});
app.get("/health", (req, res) => {
  res.json({ service: "preferences", status: "ok" });
});

app.get("/metrics", async (req, res, next) => {
  try {
    res.set("Content-Type", metricsContentType);
    res.end(await getMetrics());
  } catch (err) {
    next(err);
  }
});
// OpenAPI document (raw JSON) — for tooling; unauthenticated
app.get("/openapi.json", (req, res) => {
  res.json(swaggerSpec);
});
// Swagger UI (HTML) — unauthenticated; see setup option for OAuth if you add it later
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "User Location API (preferences)",
  })
);

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
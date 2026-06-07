import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.js";
import routes from "./routes/userLocationRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import requestMetrics from "./src/middleware/requestMetrics.js";
import { corsMiddleware } from "./src/middleware/corsMiddleware.js";
import { assertCorsOriginsProduction } from "./src/lib/corsOrigins.js";
import { getMetrics, metricsContentType } from "./src/monitoring/prometheus.js";
import { logger } from "./src/utils/logger.js";
import { getDB } from "./config/db.js";

if (process.env.NODE_ENV === "production") {
  assertCorsOriginsProduction();
}

const app = express();
app.use(corsMiddleware);
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
app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "preferences",
    status: "ok",
    uptime: process.uptime(),
  });
});

app.get("/ready", async (_req, res) => {
  try {
    await getDB().command({ ping: 1 });
    res.status(200).json({ service: "preferences", status: "ready" });
  } catch (err) {
    res.status(503).json({
      service: "preferences",
      status: "not_ready",
      error: err?.message || "database unreachable",
    });
  }
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
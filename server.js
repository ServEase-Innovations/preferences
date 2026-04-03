import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.js";
import routes from "./routes/userLocationRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";



const app = express();
app.use(cors());

// Middleware
app.use(express.json());
// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/user-settings", routes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Start server AFTER DB connection
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
    console.log(`📖 API docs available at http://localhost:${PORT}/api-docs`);
  });
});
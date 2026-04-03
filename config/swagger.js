import swaggerJSDoc from "swagger-jsdoc";
import "../swagger/userLocation.swagger.js"; // 👈 import swagger file

const baseUrl =
  process.env.BASE_URL || "http://localhost:3000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Location API",
      version: "1.0.0",
      description: "API for managing user locations"
    },
    servers: [
      {
        url: baseUrl
      }
    ]
  },

  // 👇 IMPORTANT (point to swagger folder)
  apis: ["./swagger/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
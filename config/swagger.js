import swaggerJSDoc from "swagger-jsdoc";
import "../swagger/userLocation.swagger.js"; // 👈 import swagger file

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Location API",
      version: "1.0.0",
      description: "API for managing user locations"
    },
  },

  // 👇 IMPORTANT (point to swagger folder)
  apis: ["./swagger/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
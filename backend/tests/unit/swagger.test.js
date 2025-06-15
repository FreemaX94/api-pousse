const swaggerSpec = require("../../../backend/config/swagger");

describe("swagger.js", () => {
  test("doit définir la documentation Swagger avec les bonnes infos", () => {
    expect(swaggerSpec).toHaveProperty('openapi', '3.0.0');
    expect(swaggerSpec.info).toHaveProperty('title', 'API Pousse');
  });

  test("doit définir un serveur local", () => {
    expect(swaggerSpec.servers[0].url).toBe("http://localhost:3000");
  });
});

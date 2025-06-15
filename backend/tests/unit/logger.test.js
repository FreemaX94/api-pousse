const logger = require("../../../backend/utils/logger");

describe("logger.js", () => {
  test("devrait exposer les méthodes log, warn, error, debug", () => {
    expect(typeof logger.log).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  test("log(), warn(), error() et debug() doivent s'exécuter sans erreur", () => {
    logger.log("Test log");
    logger.warn("Test warn");
    logger.error("Test error");
    logger.debug("Test debug");
  });
});

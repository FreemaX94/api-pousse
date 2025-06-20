// tests/unit/movementService.test.js

const mongoose = require("mongoose");
const NieuwkoopItem = require("../../models/nieuwkoopItemModel");
const { reserveStock, releaseStock } = require("../../services/movementService");

describe("movementService", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await NieuwkoopItem.deleteMany();
    await NieuwkoopItem.create({
      reference: "REFX",
      name: "Kentia",
      quantity: 10,
      reservedQuantity: 2
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("réserve du stock si disponible", async () => {
    await reserveStock("REFX", 3);
    const item = await NieuwkoopItem.findOne({ reference: "REFX" });
    expect(item.reservedQuantity).toBe(5); // 2 + 3
  });

  it("lève une erreur si stock insuffisant", async () => {
    await expect(reserveStock("REFX", 20)).rejects.toThrow("Stock insuffisant");
  });

  it("libère du stock après retour", async () => {
    await releaseStock("REFX", 1);
    const item = await NieuwkoopItem.findOne({ reference: "REFX" });
    expect(item.reservedQuantity).toBe(1); // 2 - 1
  });

  it("ne descend pas en dessous de zéro", async () => {
    await releaseStock("REFX", 5);
    const item = await NieuwkoopItem.findOne({ reference: "REFX" });
    expect(item.reservedQuantity).toBe(0); // Pas négatif
  });
});

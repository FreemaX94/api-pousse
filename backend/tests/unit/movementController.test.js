// tests/unit/movementController.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app"); // ← ici on extrait "app" de l'objet exporté
const Movement = require("../../models/movementModel");
const NieuwkoopItem = require("../../models/nieuwkoopItemModel");

jest.mock("../../models/nieuwkoopItemModel");

describe("Movement Controller", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Movement.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("POST /api/movements", () => {
    it("devrait créer un mouvement de type entrée", async () => {
      const res = await request(app).post("/api/movements").send({
        type: "entrée",
        reference: "REF001",
        name: "Kentia",
        quantity: 5,
        eventDate: new Date(),
        projet: "Mariage Demo",
        commentaire: "Prévu le 12",
        createdBy: "Sarah",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.type).toBe("entrée");
      expect(res.body.name).toBe("Kentia");
    });

    it("devrait retourner une erreur si des champs sont manquants", async () => {
      const res = await request(app).post("/api/movements").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Champs requis manquants");
    });
  });

  describe("GET /api/movements", () => {
    it("devrait retourner la liste des mouvements", async () => {
      await Movement.create({
        type: "entrée",
        reference: "REFX",
        name: "Ficus",
        quantity: 1,
        eventDate: new Date(),
        projet: "Test",
        createdBy: "Admin",
      });

      const res = await request(app).get("/api/movements");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

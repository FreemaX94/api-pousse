// tests/unit/movementRoutes.test.js

const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app");
const Movement = require("../../models/movementModel");

describe("movementRoutes", () => {
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

  it("POST /api/movements → crée un mouvement", async () => {
    const res = await request(app).post("/api/movements").send({
      type: "entrée",
      reference: "TEST123",
      name: "Palmier",
      quantity: 4,
      eventDate: new Date(),
      projet: "Événement test",
      createdBy: "Admin",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("reference", "TEST123");
    expect(res.body).toHaveProperty("type", "entrée");
  });

  it("GET /api/movements → retourne les mouvements", async () => {
    await Movement.create({
      type: "entrée",
      reference: "TST01",
      name: "Areca",
      quantity: 1,
      eventDate: new Date(),
      projet: "Demo",
      createdBy: "Sophie"
    });

    const res = await request(app).get("/api/movements");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

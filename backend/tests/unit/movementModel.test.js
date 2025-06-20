// tests/unit/movementModel.test.js

const mongoose = require("mongoose");
const Movement = require("../../models/movementModel");

describe("Movement Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("devrait créer un mouvement de type entrée valide", async () => {
    const movement = new Movement({
      type: "entrée",
      reference: "REF123",
      name: "Areca",
      quantity: 10,
      eventDate: new Date(),
      projet: "Salon Jardin",
      createdBy: "Sophie",
    });

    const saved = await movement.save();

    expect(saved._id).toBeDefined();
    expect(saved.type).toBe("entrée");
    expect(saved.reference).toBe("REF123");
  });

  it("devrait refuser une création sans champ obligatoire", async () => {
    const movement = new Movement({});

    let err;
    try {
      await movement.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.name).toBe("ValidationError");
  });
});

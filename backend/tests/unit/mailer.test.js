jest.mock("nodemailer"); // Mock le module
const nodemailer = require("nodemailer");

const transporterMock = {
  verify: jest.fn((cb) => cb(null, true))
};

nodemailer.createTransport.mockReturnValue(transporterMock);

describe("mailer.js", () => {
  let mailer;

  beforeAll(() => {
    jest.resetModules();
    require('dotenv').config({ path: './.env.test' }); // ✅ Charge .env
    mailer = require("../../../backend/config/mailer"); // ✅ Charge après
  });

  test("devrait créer un transporteur et vérifier la configuration", () => {
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(transporterMock.verify).toHaveBeenCalled();
    expect(mailer).toBe(transporterMock);
  });
});

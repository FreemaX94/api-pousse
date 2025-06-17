jest.resetModules();
jest.mock("nodemailer", () => {
  const verify = jest.fn((cb) => cb(null, true));
  const createTransport = jest.fn(() => ({ verify }));
  return { createTransport };
});

const nodemailer = require("nodemailer");
const transporterMock = nodemailer.createTransport();

describe("mailer.js", () => {
  let mailer;

  beforeAll(() => {
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'testpass';
    process.env.MONGO_URI = 'mongodb://localhost/test';
    process.env.JWT_SECRET = 'secret';

    mailer = require("../../../backend/config/mailer");
  });

  test("devrait créer un transporteur et vérifier la configuration", () => {
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(transporterMock.verify).toHaveBeenCalled();
    expect(mailer).toMatchObject(transporterMock); // ✅ ici
  });
});

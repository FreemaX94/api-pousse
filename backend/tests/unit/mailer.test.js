jest.mock("nodemailer");
const nodemailer = require("nodemailer");

const transporterMock = {
  verify: jest.fn((cb) => cb(null, true))
};

nodemailer.createTransport.mockReturnValue(transporterMock);

let mailer;

beforeAll(() => {
  jest.resetModules();
  require('dotenv').config({ path: './.env.test' });
  mailer = require("../../../backend/config/mailer");
});

describe("mailer.js", () => {
  test("devrait créer un transporteur et vérifier la configuration", () => {
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(transporterMock.verify).toHaveBeenCalled();
    expect(mailer).toBe(transporterMock);
  });
});

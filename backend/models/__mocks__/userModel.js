const userMock = {
  findOne: jest.fn(),
  prototype: {
    save: jest.fn(),
  }
};

module.exports = userMock;

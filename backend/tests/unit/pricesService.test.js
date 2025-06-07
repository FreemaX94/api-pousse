jest.mock('../../models/Price.js', () => ({
  create: jest.fn(),
  countDocuments: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
}));

const Price = require('../../models/Price.js');
const service = require('../../services/pricesService.js');

describe('pricesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPrice', () => {
    test('creates price and returns object', async () => {
      const doc = { toObject: jest.fn().mockReturnValue({ id: '1' }) };
      Price.create.mockResolvedValue(doc);

      const result = await service.createPrice({
        productId: '0123456789abcdef01234567',
        price: 5,
        currency: 'EUR',
      });

      expect(Price.create).toHaveBeenCalledWith({
        product: '0123456789abcdef01234567',
        price: 5,
        currency: 'EUR',
        validFrom: undefined,
      });
      expect(result).toEqual({ id: '1' });
    });

    test('throws on invalid productId', async () => {
      await expect(
        service.createPrice({ productId: 'bad', price: 1, currency: 'EUR' })
      ).rejects.toThrow();
    });
  });

  describe('countPrices', () => {
    test('counts with filter', async () => {
      Price.countDocuments.mockResolvedValue(3);
      const count = await service.countPrices({ productId: '0123456789abcdef01234567' });
      expect(Price.countDocuments).toHaveBeenCalledWith({ product: '0123456789abcdef01234567' });
      expect(count).toBe(3);
    });

    test('throws on invalid productId', () => {
      expect(() => service.countPrices({ productId: 'bad' })).toThrow();
    });
  });

  describe('listPrices', () => {
    test('returns paginated list', async () => {
      const chain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ id: '1' }]),
      };
      Price.find.mockReturnValue(chain);
      Price.countDocuments.mockResolvedValue(1);

      const result = await service.listPrices({ page: 2, limit: 10 });

      expect(Price.countDocuments).toHaveBeenCalledWith({});
      expect(Price.find).toHaveBeenCalledWith({});
      expect(chain.sort).toHaveBeenCalledWith({ validFrom: -1 });
      expect(chain.skip).toHaveBeenCalledWith(10);
      expect(chain.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual({ data: [{ id: '1' }], meta: { total: 1, page: 2, limit: 10 } });
    });

    test('throws on invalid productId', async () => {
      await expect(service.listPrices({ productId: 'bad' })).rejects.toThrow();
    });
  });

  describe('getPriceById', () => {
    test('returns document', async () => {
      const chain = { lean: jest.fn().mockResolvedValue({ id: '1' }) };
      Price.findById.mockReturnValue(chain);

      const result = await service.getPriceById('0123456789abcdef01234567');

      expect(Price.findById).toHaveBeenCalledWith('0123456789abcdef01234567');
      expect(result).toEqual({ id: '1' });
    });

    test('throws on invalid id', async () => {
      await expect(service.getPriceById('bad')).rejects.toThrow();
    });

    test('throws when not found', async () => {
      Price.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      await expect(service.getPriceById('0123456789abcdef01234567')).rejects.toThrow();
    });
  });
});

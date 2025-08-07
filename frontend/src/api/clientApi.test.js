// src/api/clientApi.test.js

import axios from 'axios';
import api, {
  getMovements,
  createMovement,
  validateMovement,
  markReturned,
  createPartnerItem,
  getPartnerItems
} from './clientApi';

vi.mock('axios', () => {
  const mApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  };
  return {
    __esModule: true,
    default: {
      create: () => mApi
    }
  };
});

describe('clientApi functions', () => {
  // Récupère l’instance mockée d’axios
  const mApi = axios.create();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getMovements should call api.get and return data', async () => {
    const mockData = [{ id: 1 }];
    mApi.get.mockResolvedValue({ data: mockData });

    const result = await getMovements();
    expect(mApi.get).toHaveBeenCalledWith('/movements');
    expect(result).toEqual(mockData);
  });

  test('createMovement should call api.post and return data', async () => {
    const movement = { foo: 'bar' };
    mApi.post.mockResolvedValue({ data: movement });

    const result = await createMovement(movement);
    expect(mApi.post).toHaveBeenCalledWith('/movements', movement);
    expect(result).toEqual(movement);
  });

  test('validateMovement should call api.put', async () => {
    mApi.put.mockResolvedValue();

    await validateMovement(123);
    expect(mApi.put).toHaveBeenCalledWith('/movements/123/validate');
  });

  test('markReturned should call api.put', async () => {
    mApi.put.mockResolvedValue();

    await markReturned(456);
    expect(mApi.put).toHaveBeenCalledWith('/movements/456/return');
  });

  test('createPartnerItem should call api.post and return data', async () => {
    const item = { name: 'Item1' };
    mApi.post.mockResolvedValue({ data: item });

    const result = await createPartnerItem(item);
    expect(mApi.post).toHaveBeenCalledWith('/partneritems', item);
    expect(result).toEqual(item);
  });

  test('getPartnerItems should call api.get and return data', async () => {
    const items = [{ id: 2 }];
    mApi.get.mockResolvedValue({ data: items });

    const result = await getPartnerItems();
    expect(mApi.get).toHaveBeenCalledWith('/partneritems');
    expect(result).toEqual(items);
  });
});

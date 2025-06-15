// Mock des variables d'environnement nécessaires
process.env.MONGO_URI = 'mongodb://localhost:27017/test-db';
process.env.JWT_SECRET = 'test-secret';
process.env.EMAIL_USER = 'test@email.com';
process.env.EMAIL_PASS = 'test-pass';
process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id';
process.env.GOOGLE_CLIENT_EMAIL = 'test@calendar.com';
process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nFAKEKEY\\n-----END PRIVATE KEY-----';

const httpMocks = require('node-mocks-http');
const calendarController = require('../../controllers/calendarController');
const calendarService = require('../../services/calendarService');

jest.mock('../../services/calendarService');

describe('calendarController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call calendarService.getEvents and return 200', async () => {
    const mockEvents = [{ id: '1' }, { id: '2' }];
    calendarService.getEvents.mockResolvedValue(mockEvents);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await calendarController.getEvents(req, res);

    expect(calendarService.getEvents).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  test('should return 400 if required body fields are missing in createEvent', async () => {
    const req = httpMocks.createRequest({
      body: { summary: '', description: '', date: '' },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await calendarController.createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  test('should create event and return 201', async () => {
    const mockEvent = { id: 'abc123' };
    calendarService.createEvent.mockResolvedValue(mockEvent);

    const req = httpMocks.createRequest({
      body: { summary: 'Test Event', description: 'Details', date: '2025-06-15T10:00:00Z' },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await calendarController.createEvent(req, res);

    expect(calendarService.createEvent).toHaveBeenCalledWith('Test Event', 'Details', '2025-06-15T10:00:00Z');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  test('should call calendarService.deleteEvent and return 200', async () => {
    calendarService.deleteEvent.mockResolvedValue();

    const req = httpMocks.createRequest({
      params: { eventId: 'abc123' },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await calendarController.deleteEvent(req, res);

    expect(calendarService.deleteEvent).toHaveBeenCalledWith('abc123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted' });
  });

  test('should call calendarService.updateEvent and return 200', async () => {
    const updated = { id: 'updated' };
    calendarService.updateEvent.mockResolvedValue(updated);

    const req = httpMocks.createRequest({
      params: { eventId: 'abc123' },
      body: {
        summary: 'New Title',
        description: 'New Desc',
        date: '2025-06-16T11:00:00Z',
      },
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await calendarController.updateEvent(req, res);

    expect(calendarService.updateEvent).toHaveBeenCalledWith(
      'abc123',
      'New Title',
      'New Desc',
      '2025-06-16T11:00:00Z'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });
});

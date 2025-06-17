describe('calendarService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();

    // ✅ Variables nécessaires à config.js
    process.env.MONGO_URI = 'mongodb://localhost/fake';
    process.env.JWT_SECRET = 'fake-secret';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'pass123';

    // ✅ Variables spécifiques au service Google Calendar
    process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id';
    process.env.GOOGLE_CLIENT_EMAIL = 'test@project.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nFAKE\\n-----END PRIVATE KEY-----\\n';

    const service = require('../../../backend/services/calendarService');
    expect(typeof service).toBe('object');
  });
});

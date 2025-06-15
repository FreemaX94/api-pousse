const { google } = require('googleapis');
const config = require('../config/config');

const getEnv = config.getEnv;

const calendarId = getEnv('GOOGLE_CALENDAR_ID');
const credentials = {
  client_email: getEnv('GOOGLE_CLIENT_EMAIL'),
  private_key: getEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n')
};

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

module.exports = {
  async getEvents() {
    const res = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime'
    });
    return res.data.items || [];
  },

  async createEvent(eventData) {
    const res = await calendar.events.insert({
      calendarId,
      requestBody: eventData
    });
    return res.data;
  },

  async deleteEvent(eventId) {
    await calendar.events.delete({
      calendarId,
      eventId
    });
  },

  async updateEvent(eventId, eventData) {
    const res = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: eventData
    });
    return res.data;
  }
};

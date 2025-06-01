const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const router = express.Router();
router.use(authMiddleware());

// Authentification Google Service Account
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../service-account.json'),
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });
const CAL_ID = process.env.GOOGLE_CALENDAR_ID;

// GET /api/events?from=ISODate
router.get('/', async (req, res) => {
  try {
    const timeMin = req.query.from || new Date().toISOString();
    const { data } = await calendar.events.list({
      calendarId: CAL_ID,
      timeMin,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(data.items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des événements');
  }
});

module.exports = router;
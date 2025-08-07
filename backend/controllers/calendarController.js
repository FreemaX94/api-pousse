const calendarService = require('../services/calendarService');

module.exports = {
  // Récupérer tous les événements
  async getEvents(req, res) {
    try {
      const events = await calendarService.getEvents();
      res.status(200).json(events);
    } catch (error) {
      console.error('[calendarController] getEvents error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des événements.' });
    }
  },

  // Créer un nouvel événement
  async createEvent(req, res) {
    const { summary, description, date } = req.body;
    if (!summary || !description || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const event = await calendarService.createEvent(summary, description, date);
      res.status(201).json(event);
    } catch (error) {
      console.error('[calendarController] createEvent error:', error);
      res.status(500).json({ message: 'Erreur lors de la création de l\'événement.' });
    }
  },

  // Mettre à jour un événement existant
  async updateEvent(req, res) {
    const { eventId } = req.params;
    const { summary, description, date } = req.body;

    try {
      const updated = await calendarService.updateEvent(eventId, summary, description, date);
      res.status(200).json(updated);
    } catch (error) {
      console.error('[calendarController] updateEvent error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'événement.' });
    }
  },

  // Supprimer un événement
  async deleteEvent(req, res) {
    const { eventId } = req.params;

    try {
      await calendarService.deleteEvent(eventId);
      res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
      console.error('[calendarController] deleteEvent error:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'événement.' });
    }
  },
};


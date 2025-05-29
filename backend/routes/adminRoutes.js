const express = require('express');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

const router = express.Router();

router.post('/seed/contracts', adminMiddleware, async (req, res, next) => {
  try {
    const { seedContracts } = await import('../seed/seedContracts.js');
    const result = await seedContracts();
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

router.post('/seed/vehicles', adminMiddleware, async (req, res, next) => {
  try {
    const { seedVehicles } = await import('../seed/seedVehicles.js');
    const result = await seedVehicles();
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route deliveries OK');
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route comptabilite OK');
});

module.exports = router;

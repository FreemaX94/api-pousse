const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route parametres OK');
});

module.exports = router;

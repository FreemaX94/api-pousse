const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route statistiques OK');
});

module.exports = router;

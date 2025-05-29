const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route livraisons OK');
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Route userRoutes OK');
});

module.exports = router;

const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(authMiddleware('admin'));

router.get('/', (req, res) => {
  res.send('Route contracts OK');
});

module.exports = router;
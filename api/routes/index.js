const express = require('express');
const router = express.Router();

// Home page redirect
router.get('/', (req, res, next) => {
  res.redirect('/api');
});

module.exports = router;
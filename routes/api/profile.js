const express = require('express');
const router = express.Router();

// @route GET api/profile
// @desc profiles route
// @access Public
router.get('/', (req, res) => {
  res.json({msg: 'profile works'});
});

module.exports = router;
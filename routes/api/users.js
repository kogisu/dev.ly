const express = require('express');
const router = express.Router();
const db = require('../../db');

// @route GET api/users
// @desc users route
// @access Public
router.get('/', async (req, res) => {
  console.log('getting users');
  const users = await db.getAllUsers();
  console.log('users: ', users);
  res.json({msg: 'users works'});
});

router.post('/register', async (req, res) => {
  console.log('posting users');
  const user = await db.createUser(req.body);
  console.los('user: ', user);
});

module.exports = router;
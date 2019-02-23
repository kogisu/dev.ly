const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const db = require('../../db');
const utils = require('../../utilities/helpers');
const router = express.Router();

// @route GET api/users
// @desc users route
// @access Public
router.get('/', async (req, res) => {
  console.log('getting users');
  const users = await db.getAllUsers();
  console.log('users: ', users);
  res.json(users);
});

// @route POST api/users/register
// @desc users route
// @access Public
router.post('/register', async (req, res) => {
  const userData = Object.assign({}, req.body);
  try {
    const existingUser = await db.findUser(userData);
    if (existingUser.length < 1) {
      const avatar = gravatar.url(userData.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      //Encrypt password and replace
      const password = await utils.encryptPassword(userData.password);
      userData.password = password;

      //Create user
      const user = await db.createUser(userData);
      res.status(201).json({msg: 'post successful'});
    } else {
      res.status(400).json({email: 'Email already exists'});
    }
  } catch(err) {
    
  }
});

module.exports = router;
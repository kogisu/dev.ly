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
      userData.avatar = avatar;

      //Encrypt password and replace
      const password = await utils.encryptPassword(userData.password);
      userData.password = password;

      //Create user
      const user = await db.createUser(userData);
      res.status(201).json(user);
    } else {
      res.status(400).json({email: 'Email already exists'});
    }
  } catch(err) {
    res.status(500).json({msg: 'error occured'});
  }
});

// @route POST api/users/login
// @desc Login user / Returning JWT Token
// @access Public
router.post('/login', async (req, res) => {
  const userData = req.body;
  try {
    const user = await db.findUser(userData);
    if (!user.length) {
      return res.status(404).json({email: 'User not found'});
    }
    const msg = await utils.checkPassword(userData.password, user[0].password);
    if (msg.msg) {
      res.json(msg);
    } else {
      res.status(400).json(msg);
    }
  } catch(err) {
    console.log(err);
    res.status(400).json({email: 'User not found'});
  }

  // @route POST api/users/login
  // @desc users route
  // @access Public
});
module.exports = router;
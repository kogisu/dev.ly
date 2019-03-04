const express = require('express');
const gravatar = require('gravatar');
const passport = require('passport');
const db = require('../../db/queries');
const utils = require('../../utilities/helpers');
const router = express.Router();

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

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
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

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
  const { errors, isValid } = validateLoginInput(req.body);
  const userData = req.body;

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const user = await db.findUser(userData);
    if (!user.length) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    const msg = await utils.checkPassword(userData.password, user[0]);
    if (msg.success) {
      res.json(msg);
    } else {
      errors.password = 'Password incorrect';
      res.status(400).json(errors);
    }
  } catch(err) {
    console.log(err);
    res.status(400).json(errors);
  }

  // @route POST api/users/current
  // @desc Return current user
  // @access Private
  router.get('/current', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
  });
});
module.exports = router;
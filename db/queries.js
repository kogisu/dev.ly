const config = require('../server/config');
const User = require('./User');

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

module.exports = {
  getAllUsers: async function() {
    try {
      const res = await User.findAll();
      return res;
    } catch(err) {
      return `error occured in finding user: ${err}`;
    }
  },
  createUser: async function(userData) {
      const {name, email, password, avatar} = userData;
      try {
        const res = await User.create({
          name, 
          email, 
          password, 
          avatar
        });
        return res;
      } catch(err) {
        return `error occured in finding user: ${err}`;
      }
  },
  findUser: async function(userData) {
    try {
      const res = await User.findAll({
        where: {
          email: userData.email
        }
      });
      return res;
    } catch(err) {
      return `error occured in finding user: ${err}`;
    }
  }
}


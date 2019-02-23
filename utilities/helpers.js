const bcrypt = require('bcryptjs');
const config = require('../server/config');
const jwt = require('jsonwebtoken');

module.exports = {
  encryptPassword: function(password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(`error occured in encrypting password: `, err);
          }
          resolve(hash);
        });;
      });
    });
  },
  checkPassword: function(password, user) {
    const userPass = user.password;
    return new Promise((resolve) => {
      bcrypt.compare(password, userPass)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };
            jwt.sign(
              payload, 
              config.SECRET, 
              { expiresIn: 3600}, 
              (err, token) => {
                if (err) {
                  reject(`error occured in getting jwt: ${err}`);
                }
                resolve({
                  success: true,
                  token: 'Bearer ' + token
                });
            });
          } else {
            resolve({password: 'Password incorrect'});
          }
        });
    });
  }
}
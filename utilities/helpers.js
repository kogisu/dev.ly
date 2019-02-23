const bcrypt = require('bcryptjs');

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
  checkPassword: function(password, userPass) {
    return new Promise((resolve) => {
      bcrypt.compare(password, userPass)
        .then(isMatch => {
          if (isMatch) {
            resolve({msg: 'Success'});
          } else {
            resolve({password: 'Password incorrect'});
          }
        });
    });
  }
}
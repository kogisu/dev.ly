const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../../db');
const config = require('./index');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRET;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const queryStr =  `select * from users where id=${jwt_payload.id}`;
      try {
        const user = await db.queryDB(queryStr, []);
        if (user.length) {
          return done(null, user[0]);
        }
        return done(null, false);
      } catch(err) {
        console.log('err');
      }
    })
  );
};
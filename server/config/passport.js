const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../db/User');
const config = require('./index');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRET;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findAll({
          where: {
            id: jwt_payload.id
          }
        });

        if (user.length) {
          return done(null, user[0]);
        }
        return done(null, false);
      } catch(err) {
        console.log(`error occured in authenticating password: ${err}`);
      }
    })
  );
};
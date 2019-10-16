const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");

const { JWT_SECRET } = require("../configs/key");
const Users = require("../models/users");

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy(function(username, password, done) {
    return Users.findOne({ username })
      .then(user => {
        // wrong username
        if (!user) {
          return done(null, false, { message: "No username matched." });
        } else {
          bcrypt.compare(password, user.password).then(function(isOk) {
            if (isOk)
              return done(null, user, { message: "Logged in successfully." });
            // wrong password
            else return done(null, false, { message: "Wrong password." });
          });
        }
      })
      .catch(err => done(err));
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    function(jwtPayload, done) {
      return Users.findOne({ _id: jwtPayload.id })
        .then(user => {
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);

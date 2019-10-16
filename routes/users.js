const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const debug = require("debug")("caro-back:server");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const { JWT_SECRET } = require("../configs/key");
const Users = require("../models/users");

/* GET users listing. */
router.get("/me", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  res.status(200).send(req.user);
});

/* POST users listing. */
router.post("/register", function(req, res, next) {
  // check user
  Users.findOne({ username: req.body.username })
    .then(user => {
      debug("suc get user", user);

      res.status(500).send("This username has been used already!");
    })
    .catch(next);

  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, function(err, hashedPwd) {
    // if err when hash
    if (err) {
      debug("err when hash");
      next(err);
    }

    // hash successfully
    const user = new Users({
      username: req.body.username,
      password: hashedPwd
    });

    // save into database
    user
      .save()
      .then(user => debug("suc save new user", user))
      .catch(next);
  });
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user
      });
    }

    // login info ok
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;

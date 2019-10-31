const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const debug = require("debug")("caro-back:server");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const { JWT_SECRET } = require("../configs/key");
const Users = require("../models/users");

/* GET users listing. */
router.get("/me", passport.authenticate("jwt"), function(req, res) {
  console.log(req.user);
  res.status(200).send(req.user);
});

/* POST users listing. */
router.post("/register", function(req, res, next) {
  console.log(req.body);
  // check user
  Users.findOne({ username: req.body.username })
    .then(user => {
      debug("suc get user", user);

      if (user) {
        res.statusCode = 409;
        return res.status(409).send("Username already exists!");
      }
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
      fullname: req.body.fullname,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hashedPwd
    });

    // save into database
    user
      .save()
      .then(result => {
        debug("suc save new user", result);
        if (result) {
          return res.status(201).send("Created successfully!");
        }
      })
      .catch(next);
  });
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        message: info && info.message,
        user: user
      });
    }

    // login info ok
    req.login(user, err => {
      if (err) {
        return res.status(500).send(err);
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return res.status(200).json({ user, token });
    });
  })(req, res, next);
});

module.exports = router;

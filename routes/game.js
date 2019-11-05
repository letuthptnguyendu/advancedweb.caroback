const express = require("express");
const router = express.Router();
const passport = require("passport");

const Games = require("../models/games");
const Users = require("../models/users");

router.get("/new", passport.authenticate("jwt"), function(req, res) {
  const game = new Games({
    user_id: req.user._id,
    type: "pvc",
    history: [],
    status: ""
  });

  game
    .save()
    .then(id => {
      return res.status(201).json(id);
    })
    .catch(err => console.log("letu err save game", err));
});

router.get("/:gid", passport.authenticate("jwt"), function(req, res) {
  Games.findOne({ _id: req.params.gid })
    .then(data => {
      return res.status(201).json(data);
    })
    .catch(err => console.log("letu err get game", err));
});

router.post("/:gid/jump", passport.authenticate("jwt"), function(req, res) {
  Games.findOne({ _id: req.params.gid })
    .then(data => {
      Games.updateOne(
        { _id: req.params.gid },
        { $set: { history: data.history.splice(0, req.body.step + 1) } }
      )
        .then(data2 => {
          return res.status(200).json(data2);
        })
        .catch(err => console.log("letu err update user", err));
    })
    .catch(err => console.log("letu err get game", err));
});

router.post("/:gid", passport.authenticate("jwt"), function(req, res) {
  Games.updateOne(
    { _id: req.params.gid },
    { $push: { history: [req.body.position] } }
  )
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => console.log("letu err update user", err));
});

module.exports = router;

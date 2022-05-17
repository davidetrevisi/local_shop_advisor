const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Cliente = require("./models/account").Cliente; // get our mongoose model
const Venditore = require("./models/account").Venditore; // get our mongoose model
const Account = require("./models/account").Account; // get our mongoose model

// Login utente

router.post("", async function (req, res) {
  // find the user
  let user = await Account.findOne({
    email: req.body.email,
  }).exec();

  console.log(user);

  // user not found
  if (!user) {
    res.json({
      success: false,
      message: "Authentication failed. User not found.",
    });
  }

  if (user) {
    // check if password matches
    if (user.password != req.body.password) {
      res.json({
        success: false,
        message: "Authentication failed. Wrong password.",
      });
    }

    // if user is found and password is right create a token
    var payload = {
      email: user.email,
      id: user._id,
      // other data encrypted in the token
    };
    var options = {
      expiresIn: 86400, // expires in 24 hours
    };
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
      success: true,
      message: "Enjoy your token!",
      token: token,
      email: user.email,
      id: user._id,
      self: "api/v1/" + user._id,
    });
    console.log("OK");
  }
});

// Get lista utenti

router.get("", async (req, res) => {
  let users = await Account.find({});
  users = users.map((user) => {
    return {
      self: "/api/v1/authentication/" + user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
    };
  });
  res.status(200).json(users);
});

// Eliminazione di un account

router.delete("/:id", async (req, res) => {
  let product = await Account.findByIdAndRemove(req.params.id);
  res.status(204).send();
  console.log("Account rimosso correttamente dal catalogo");
});

module.exports = router;

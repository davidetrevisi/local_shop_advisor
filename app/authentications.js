const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const tokenChecker = require("./tokenChecker.js");

const Account = require("./models/account").Account; // get our mongoose model
const Cliente = require("./models/account").Cliente;
const Venditore = require("./models/account").Venditore;

// Login utente

router.post("/login", async function (req, res) {
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
      account: user.__t,
    };
    var options = {
      expiresIn: 86400, // expires in 24 hours
    };
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res
      .cookie("token", token, {})
      .status(200)
      .json({
        success: true,
        message: "Enjoy your token!",
        token: token,
        account: user.__t,
        email: user.email,
        id: user._id,
        self: "api/v1/authentication/" + user._id,
      });
  }
});

// Registrazione utente

router.post("/signup", async function (req, res) {
  var user_type = JSON.stringify(req.body.account);

  if (user_type.toLowerCase().indexOf("cliente") === 1) {
    var user = new Cliente({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      payment: req.body.payment,
      "shipping_address.city": req.body.shipping_city,
      "shipping_address.CAP": req.body.shipping_CAP,
      "shipping_address.street": req.body.shipping_street,
      "shipping_address.number": req.body.shipping_number,
      "billing_address.city": req.body.billing_city,
      "billing_address.CAP": req.body.billing_CAP,
      "billing_address.street": req.body.billing_street,
      "billing_address.number": req.body.billing_number,
    });

    user = await user.save();

    console.log("Utente aggiunto correttamente");
    res
      .location("/api/v1/authentications/users/" + user.id)
      .status(201)
      .send();
  } else if (user_type.toLowerCase().indexOf("venditore") === 1) {
    var user = new Venditore({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      "personal_address.city": req.body.personal_city,
      "personal_address.CAP": req.body.personal_CAP,
      "personal_address.street": req.body.personal_street,
      "personal_address.number": req.body.personal_number,
    });

    user = await user.save();

    console.log("Utente aggiunto correttamente");
    res
      .location("/api/v1/authentications/users/" + user.id)
      .status(201)
      .send();
  } else {
    console.log("Errore nell'aggiunta utente");
    res
      .json({
        message: "Errore nell'aggiunta utente",
      })
      .status(400)
      .send();
  }
});

// Logout

router.get("/logout", tokenChecker, async (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

// Get lista utenti

router.get("/users", tokenChecker, async (req, res) => {
  if (req.userAccount == "Admin") {
    let users = await Account.find({});
    users = users.map((user) => {
      return {
        self: "/api/v1/authentication/users/" + user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
        account: user.__t,
      };
    });
    res.status(200).json(users);
  }
});

// Eliminazione di un account

router.delete("/users/:id", tokenChecker, async (req, res) => {
  if (req.userAccount == "Admin") {
    let product = await Account.findByIdAndRemove(req.params.id);
    console.log("Account rimosso correttamente dal catalogo");
    res.status(204).send();
  }
});

module.exports = router;

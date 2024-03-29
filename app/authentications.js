const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const tokenChecker = require("./tokenChecker.js");

const Address = require("./models/account").Address;
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
    res.status(401).json({
      success: false,
      message: "Authentication failed. User not found.",
    });
  }

  if (user) {
    // check if password matches
    if (user.password != req.body.password) {
      res.status(402).json({
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
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(200)
      .json({
        success: true,
        message: "Enjoy your token!",
        token: token,
        account: user.__t,
        email: user.email,
        id: user._id,
        name: user.name,
        surname: user.surname,
        self: "api/v2/authentication/" + user._id,
      });
    console.log("Token emesso!");
  }
});

// Registrazione utente

router.post("/signup", async function (req, res) {
  var user_type = JSON.stringify(req.body.account);

  let existing = await Account.findOne({
    email: req.body.email,
  });

  if (!existing) {
    if (user_type.toLowerCase().indexOf("cliente") === 1) {
      let shipping_address = await Address.findOne({
        city: req.body.shipping_city,
        CAP: req.body.shipping_CAP,
        street: req.body.shipping_street,
        number: req.body.shipping_number,
      });

      if (!shipping_address) {
        var shipping_address_schema = new Address({
          city: req.body.shipping_city,
          CAP: req.body.shipping_CAP,
          street: req.body.shipping_street,
          number: req.body.shipping_number,
        });

        shipping_address_schema = await shipping_address_schema.save();
        shipping_address = shipping_address_schema;
      }

      let billing_address = await Address.findOne({
        city: req.body.billing_city,
        CAP: req.body.billing_CAP,
        street: req.body.billing_street,
        number: req.body.billing_number,
      });

      if (!billing_address) {
        var billing_address_schema = new Address({
          city: req.body.billing_city,
          CAP: req.body.billing_CAP,
          street: req.body.billing_street,
          number: req.body.billing_number,
        });

        billing_address_schema = await billing_address_schema.save();
        billing_address = billing_address_schema;
      }

      var user = new Cliente({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        birthdate: req.body.birthdate,
        payment: req.body.payment,
        shipping_address: shipping_address.id,
        billing_address: billing_address.id,
      });

      user = await user.save();

      console.log("Utente aggiunto correttamente");
      res
        .location("/api/v2/authentications/users/" + user.id)
        .status(201)
        .send();
    } else if (user_type.toLowerCase().indexOf("venditore") === 1) {
      let personal_address = await Address.findOne({
        city: req.body.personal_city,
        CAP: req.body.personal_CAP,
        street: req.body.personal_street,
        number: req.body.personal_number,
      });

      if (!personal_address) {
        var personal_address_schema = new Address({
          city: req.body.personal_city,
          CAP: req.body.personal_CAP,
          street: req.body.personal_street,
          number: req.body.personal_number,
        });

        personal_address_schema = await personal_address_schema.save();
        personal_address = personal_address_schema;
      }

      var user = new Venditore({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        birthdate: req.body.birthdate,
        personal_address: personal_address.id,
      });

      user = await user.save();

      console.log("Utente aggiunto correttamente");
      res
        .location("/api/v2/authentications/users/" + user.id)
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
  } else {
    res.status(401).json({
      success: false,
      message: "Account già esistente",
    });
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
    let users = await Account.find({})
      .populate("personal_address")
      .populate("shipping_address")
      .populate("billing_address");
    if (users) {
      console.log(users);
      users = users.map((user) => {
        return {
          self: "/api/v2/authentication/users/" + user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          password: user.password,
          account: user.__t,
        };
      });
      res.status(200).json(users);
    } else {
      res.status(401).json({
        success: false,
        message: "Errore nel GET degli utenti",
      });
    }
  }
});

// Get utente singolo

router.get("/users/:id", tokenChecker, async (req, res) => {
  let user = await Account.findById(req.params.id)
    .populate("personal_address")
    .populate("shipping_address")
    .populate("billing_address");
  if (user) {
    if (req.userAccount == "Venditore") {
      res.status(200).json({
        self: "/api/v2/authentications/users/" + user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        birthdate: user.birthdate,
        personal_address: user.personal_address,
      });
    } else if (req.userAccount == "Cliente") {
      res.status(200).json({
        self: "/api/v2/authentications/users/" + user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        birthdate: user.birthdate,
        payment: user.payment,
        shipping_address: user.shipping_address,
        billing_address: user.billing_address,
      });
    } else {
      res.status(200).json({
        self: "/api/v2/authentications/users/" + user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Errore nel GET del singolo utente",
    });
  }
});

// Eliminazione di un account

router.delete("/users/:id", tokenChecker, async (req, res) => {
  if (req.userAccount == "Admin") {
    let user = await Account.findById(req.params.id);
    var temp_user = user;

    if (!user) {
      res.status(401).send();
      console.log("User not found");
      return;
    }

    await user.deleteOne();
    let temp_addr;
    if (temp_user.__t == "Cliente") {
      let other_users = await Cliente.find({
        $or: [
          { shipping_address: temp_user.shipping_address },
          { billing_address: temp_user.shipping_address },
        ],
      });

      if (!other_users) {
        temp_addr = Address.findByIdAndDelete(temp_user.shipping_address);
      }

      other_users = await Cliente.find({
        $or: [
          { shipping_address: temp_user.billing_address },
          { billing_address: temp_user.billing_address },
        ],
      });

      if (!other_users) {
        temp_addr = Address.findByIdAndDelete(temp_user.billing_address);
      }
    } else if (user.__t == "Venditore") {
      let other_users = await Venditore.find({
        $or: [{ personal_address: temp_user.personal_address }],
      });

      if (!other_users) {
        temp_addr = Address.findByIdAndDelete(temp_user.personalS_address);
      }
    }

    console.log("Account rimosso correttamente dal catalogo");
    res.status(204).send();
  }
});

module.exports = router;

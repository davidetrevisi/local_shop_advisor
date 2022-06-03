const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

const Shop = require("./models/shop");
const tokenChecker = require("./tokenChecker");

// Funzione per rimozione immagini

function deleteFiles(files, callback) {
  var i = files.length;
  files.forEach(function (filepath) {
    fs.unlink(filepath, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

// Aggiunta di un negozio

router.post("", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let shop = new Shop({
      name: req.body.name,
      description: req.body.description,
      position: req.body.position,
      category: req.body.category,
      tags: req.body.tags,
      userId: req.body.userId,
      images: req.files.map((file) => file.path),
    });

    shop = await shop.save();

    let shopId = shop.id;

    console.log("Negozio creato correttamente");
    res
      .location("/api/v2/shops/" + shopId)
      .status(201)
      .send();
  }
});

// Get lista negozi

router.get("", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let shops = await Shop.find({});
    shops = shops.map((shop) => {
      return {
        self: "/api/v2/shops/" + shop.id,
        name: shop.name,
        description: shop.description,
        position: shop.position,
        category: shop.category,
        tags: shop.tags,
        images: shop.images,
        userId: shop.userId,
        id: shop.id,
      };
    });
    res.status(200).json(shops);
  }
});

// Get singolo negozio

router.get("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin" || user_type === "Cliente") {
    let shop = await Shop.findById(req.params.id);
    res.status(200).json({
      self: "/api/v2/shops/" + shop.id,
      name: shop.name,
      description: shop.description,
      position: shop.position,
      category: shop.category,
      tags: shop.tags,
      images: shop.images,
      userId: shop.userId,
      id: shop.id,
    });
  }
});

// Get negozi di un singolo utente

router.get("/list/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let shops = await Shop.find({ userId: req.params.id });
    shops = shops.map((shop) => {
      return {
        self: "/api/v2/shops/" + shop.id,
        name: shop.name,
        description: shop.description,
        position: shop.position,
        category: shop.category,
        tags: shop.tags,
        images: shop.images,
        userId: shop.userId,
        id: shop.id,
      };
    });
    res.status(200).json(shops);
  }
});

// Eliminazione di un negozio

router.delete("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let shop = await Shop.findById(req.params.id).exec();

    if (!shop) {
      res.status(404).send();
      console.log("Shop not found");
      return;
    }

    deleteFiles(shop.images, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("All images removed");
      }
    });

    await shop.deleteOne();

    res.status(204).send();
    console.log("Negozio rimosso correttamente");
  }
});

//Modifica di un negozio

router.put("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let shop = await Shop.findOneAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      position: req.body.position,
      category: req.body.category,
      tags: req.body.tags,
      images: req.files.map((file) => file.path),
      userId: req.body.userId,
    });
    let shopId = shop.id;
    console.log("Negozio modificato correttamente");
    res
      .location("/api/v2/shops/" + shopId)
      .status(200)
      .send();
  }
});

module.exports = router;

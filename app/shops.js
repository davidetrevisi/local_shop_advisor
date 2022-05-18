const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

const Shop = require("./models/shop");

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

router.post("", async (req, res) => {
  let shop = new Shop({
    name: req.body.name,
    description: req.body.description,
    position: req.body.position,
    category: req.body.category,
    tags: req.body.tags,
    images: req.files.map((file) => file.path),
  });

  shop = await shop.save();

  let shopId = shop.id;

  console.log("Negozio creato correttamente");
  res
    .location("/api/v1/shops/" + shopId)
    .status(201)
    .send();
});

// Get lista negozi

router.get("", async (req, res) => {
  let shops = await Shop.find({});
  shops = shops.map((shop) => {
    return {
      self: "/api/v1/shops/" + shop.id,
      name: shop.name,
      description: shop.description,
      position: shop.position,
      category: shop.category,
      tags: shop.tags,
      images: shop.images,
    };
  });
  res.status(200).json(shops);
});

// Get singolo negozio

router.get("/:id", async (req, res) => {
  let shop = await Shop.findById(req.params.id);
  res.status(200).json({
    self: "/api/v1/shops/" + shop.id,
    name: shop.name,
    description: shop.description,
    position: shop.position,
    category: shop.category,
    tags: shop.tags,
    images: shop.images,
  });
});

// Eliminazione di un negozio

router.delete("/:id", async (req, res) => {
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
});


//Modifica di un negozio
router.put("/:id", async (req, res) => {
  let shop = await Shop.findOneAndUpdate(req.params.id, {name: req.body.name,  description: req.body.description, position: req.body.position, category: req.body.category, tags: req.body.tags, images: req.files.map((file) => file.path)} );
  let shopId = shop.id;
  console.log("Negozio modificato correttamente");
  res
    .location("/api/v1/shops/" + shopId)
    .status(200)
    .send(); 
});

module.exports = router;
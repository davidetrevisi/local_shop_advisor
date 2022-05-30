const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

const Product = require("./models/product");
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

// Aggiunta di un prodotto al catalogo

router.post("", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      tags: req.body.tags,
      images: req.files.map((file) => file.path),
      userId: req.body.userId,
    });

    product = await product.save();

    let productId = product.id;

    console.log("Prodotto aggiunto correttamente al catalogo");
    console.log(productId);
    res
      .location("/api/v2/products/" + productId)
      .status(201)
      .send();
  }
});

// Get catalogo completo

router.get("", async (req, res) => {
  let products = await Product.find({});
  products = products.map((product) => {
    return {
      self: "/api/v2/products/" + product.id,
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      tags: product.tags,
      images: product.images,
      userId: product.userId,
    };
  });
  res.status(200).json(products);
});

// Get singolo prodotto

router.get("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  res.status(200).json({
    self: "/api/v2/products/" + product.id,
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    tags: product.tags,
    images: product.images,
    userId: product.userId,
  });
});

// Eliminazione di un prodotto

router.delete("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let product = await Product.findById(req.params.id).exec();

    if (!product) {
      res.status(404).send();
      console.log("Product not found");
      return;
    }

    deleteFiles(product.images, function (err) {
      if (err) {
        res.status(400).send();
        console.log("Cannot delete images");
      } else {
        console.log("All images removed");
      }
    });

    await product.deleteOne();

    res.status(204).send();
    console.log("Prodotto rimosso correttamente dal catalogo");
  }
});

//Ricerca di un prodotto per nome

router.get("/find/:name", async (req, res) => {
  let products = await Product.find({ name: req.params.name });
  products = products.map((product) => {
    return {
      self: "/api/v2/products/" + product.id,
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      tags: product.tags,
      images: product.images,
      userId: product.userId,
    };
  });
  res.status(200).json(products);
});

//Modifica di un prodotto

router.put("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      tags: req.body.tags,
      images: req.files.map((file) => file.path),
      userId: req.body.userId,
    });
    let productId = product.id;
    console.log("Prodotto modificato correttamente");
    console.log(productId);
    res
      .location("/api/v2/products/" + productId)
      .status(200)
      .send();
  }
});

// Get di tutti i prodotti di un determinato account

router.get("/catalog/:id", async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore") {
    let products = await Product.find({ userId: req.params.id });
    products = products.map((product) => {
      return {
        self: "/api/v2/products/" + product.id,
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        tags: product.tags,
        images: product.images,
        userId: product.userId,
      };
    });
    res.status(200).json(products);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

const Product = require("./models/product");

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

router.post("", async (req, res) => {
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    tags: req.body.tags,
    //images: req.files.map((file) => file.path),
  });

  product = await product.save();

  let productId = product.id;

  console.log("Prodotto aggiunto correttamente al catalogo");
  console.log(productId);
  res
    .location("/api/v1/products/" + productId)
    .status(201)
    .send();
});

// Get catalogo completo

router.get("", async (req, res) => {
  let products = await Product.find({});
  products = products.map((product) => {
    return {
      self: "/api/v1/products/" + product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      tags: product.tags,
      //images: product.images,
    };
  });
  res.status(200).json(products);
});

// Get singolo prodotto

router.get("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  res.status(200).json({
    self: "/api/v1/products/" + product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    tags: product.tags,
    //images: product.images,
  });
});

// Eliminazione di un prodotto

router.delete("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id).exec();

  if (!product) {
    res.status(404).send();
    console.log("Product not found");
    return;
  }

  deleteFiles(product.images, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("All images removed");
    }
  });

  await product.deleteOne();

  res.status(204).send();
  console.log("Prodotto rimosso correttamente dal catalogo");
});

//Ricerca di un prodotto per nome
router.get("/find/:name", async (req, res) => {
  let products = await Product.find({ name: req.params.name });
  products = products.map((product) => {
    return {
      self: "/api/v1/products/" + product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      tags: product.tags,
    };
  });
  res.status(200).json(products);
});

//Modifica di un prodotto
router.put("/:id", async (req, res) => {
  let product = await Product.findByIdAndUpdate(req.params.id, { name: req.body.name, description: req.body.description, price: req.body.price, category: req.body.category, /*tags: req.body.tags, images: req.files.map((file) => file.path)*/ });
  let productId = product.id;
  console.log("Prodotto modificato correttamente");
  console.log(productId);
  res
    .location("/api/v1/products/" + productId)
    .status(200)
    .send();
});

module.exports = router;

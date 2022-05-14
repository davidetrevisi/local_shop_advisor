const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// Importo il modello del prodotto dalla cartella models

const Product = require("./models/product");

// Aggiunta di un prodotto al catalogo

router.post("", async (req, res) => {
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    tags: req.body.tags,
    // images: req.body.images
  });

  product = await product.save();

  let productId = product.id;

  console.log("Prodotto aggiunto correttamente al catalogo");
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
  });
});

// Eliminazione di un prodotto

router.delete("/:id", async (req, res) => {
  let product = await Product.findByIdAndRemove(req.params.id);
  res.status(204).send();
  console.log("Prodotto rimosso correttamente dal catalogo");
});


//Ricerca di un prodotto per nome
router.get("/:name", async (req, res) => {
  let products = await Product.find({name: req.params.name});
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


module.exports = router;

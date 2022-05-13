const express = require("express");
const router = express.Router();

// Importo il modello del prodotto dalla cartella models

const Product = require("./models/product");

//
// Aggiunta di un prodotto al catalogo
router.post("", async (req, res) => {
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    // tag: req.body.tag,
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

//Catalogo completo

router.get("", async (req, res) => {
  let products = await Product.find({});
  products = products.map((product) => {
    return {
      self: "/api/v1/products/" + product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
    };
  });
  res.status(200).json(products);
});

//Ricerca singolo prodotto 

router.get('/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/products/' + product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category
    });
});

module.exports = router;

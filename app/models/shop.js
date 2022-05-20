const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product");

// nome, posizione, categoria e tag, descrizione e immagini
const shopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  tags: [String],
  images: [String],
});

// Creo il modello del prodotto dallo schema

const Shop = mongoose.model("Shop", shopSchema);

// Esporto il modello

module.exports = Shop;

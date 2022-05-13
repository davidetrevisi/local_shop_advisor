import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema dei prodotti: nome, descrizione, prezzo (0-5000), categoria, tags, immagini

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    max: 5000,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  images: [
    // Da rivedere l'implementazione
    {
      data: Buffer,
      contentType: String,
      required: true,
    },
  ],
  // Nel caso servano in futuro
  // comments:
  // reviews:
});

// Creo il modello del prodotto dallo schema

const Product = mongoose.model("Product", productSchema);

// Esporto il modello

module.exports = Product;

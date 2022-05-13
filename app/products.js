import express from "express";
const router = express.Router();

// Importo il modello del prodotto dalla cartella models

const Product = require("./models/product");

//
// PARTE DEI METODI REST DA INSERIRE QUI
router.get('', async (req, res) => {
//

module.exports = router;

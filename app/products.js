import express from "express";
const router = express.Router();

// Importo il modello del prodotto dalla cartella models

const Product = require("./models/product");

//
// Aggiunta di un prodotto al catalogo
router.post('', async (req, res) => {

	let product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        tag: req.body.tag,
        images: req.body.images
    });
    
	product = await product.save();
    
    let productId = product.id;

    console.log('Prodotto aggiunto correttamente al catalogo');
    res.location("/api/v1/products/" + productId).status(201).send();
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

//const Product = require("./models/product");
const Cart = require("./models/cart");
const Product = require("./models/product");

router.post("", async (req, res) => {
    const { userId, itemId, note } = req.body;
    let data = null;

    const quantity = Number.parseInt(req.body.quantity);

    let cart = await Cart.findOne({ userId: userId });
    const productDetails = await Product.findById(itemId);

    console.log("productDetails", productDetails)

    //-- Check if cart Exists and Check the quantity if items -------
    if (cart) {
        let indexFound = cart.items.findIndex(item => item.productId == itemId);
        console.log("Index", indexFound)
        //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
        if (indexFound != -1 && quantity == 0) {
            cart.items.splice(indexFound, 1);
            if (cart.items.length == 0) {
                cart.subTotal = 0;
            } else {
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next)
            }
        }
        if (indexFound != -1 && quantity != 0) {
            cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
            cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
            cart.items[indexFound].price = productDetails.price
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
        }

        //----Check if Quantity is Greater than 0 then add item to items Array ----
        else if (quantity > 0) {
            cart.items.push({
                productId: itemId,
                quantity: quantity,
                price: productDetails.price,
                total: parseInt(productDetails.price * quantity).toFixed(2),
            })
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
        }


        data = await cart.save();
    }
    //------if there is no user with a cart then it creates a new cart and then adds the item to the cart that has been created---------
    else {
        const cartData = {
            userId: userId,
            items: [{
                productId: itemId,
                quantity: quantity,
                total: parseInt(productDetails.price * quantity),
                price: productDetails.price,
                note: note

            }],
            subTotal: parseInt(productDetails.price * quantity)
        }
        cart = new Cart(cartData);
        data = await cart.save();
    }

    return res.status(200).send({
        code: 200,
        message: "Add to Cart successfully!",
        data: data
    });
});

router.get("/:id", async (req, res) => {

    let cart = await Cart.findOne({ userId: req.params.id });
    if (cart) {
    res.status(200).json({
        self: "/api/v1/carts/" + cart.id,
        user: cart.userId,
        items: cart.items,
        subTotal: cart.subTotal,
    });}
    else {
        
        cart = new Cart();
        data = await cart.save();
        res.status(200).send({
            code: 200,
            message: "Cart created!",
            data: data
        });    }

});



module.exports = router;
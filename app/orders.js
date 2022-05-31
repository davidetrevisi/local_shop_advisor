const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

//const Product = require("./models/product");
const Order = require("./models/order");
const Product = require("./models/product");
const Cart = require("./models/cart");
const Cliente = require("./models/account").Cliente;
const Address = require("./models/account").Address;
router.post("", async (req, res) => {
    const { customerId, status  } = req.body;
    let data = null;
    let cart = await Cart.findOne({ userId: customerId });
    let customer = await Cliente.findById(customerId).populate("shipping_address");
    const product = await Product.findById(cart.items[0].productId);
    //let address = await Address.findOne(customer.shipping_address);
        const orderData = {
            customerId: customerId,
            items: cart.items,
            subTotal: cart.subTotal,
            sellerId: product.userId,
            status: status,
            payment: customer.payment,
            shipping_address: customer.shipping_address,
        }
       let order = new Order(orderData);
        data = await order.save();
        console.log(order)
    return res.status(200).send({
        code: 200,
        message: "Order created successfully!",
        data: data
    });
});

router.get("/:id", async (req, res) => {

    let order = await Order.findById(req.params.id).populate("shipping_address");
    res.status(200).json({
        self: "/api/v1/orders/" + order.id,
        customerId: order.customerId,
        items: order.items,
        subTotal: order.subTotal,
        status: order.status,
        id: order.id,
        payment:order.payment,
        sellerId: order.sellerId,
        shipping_address: order.shipping_address,
    });
});
router.get("/catalog/:id", async (req, res) => {
    let orders = await Order.find({customerId: req.params.id});
    orders = orders.map((order) => {
      return {
        self: "/api/v1/orders/" + order.id,
        customerId: order.customerId,
        items: order.items,
        subTotal: order.subTotal,
        status: order.status,
        id: order.id,
        payment:order.payment,
        sellerId: order.sellerId,
        shipping_address: order.shipping_address,
      };
    });
    res.status(200).json(orders);
  });
  router.get("/catalogv/:id", async (req, res) => {
    let orders = await Order.find({sellerId: req.params.id});
    orders = orders.map((order) => {
      return {
        self: "/api/v1/orders/" + order.id,
        customerId: order.customerId,
        items: order.items,
        subTotal: order.subTotal,
        status: order.status,
        id: order.id,
        payment:order.payment,
        sellerId: order.sellerId,
        shipping_address: order.shipping_address,
      };
    });
    res.status(200).json(orders);
  });

  router.delete("/:id", async (req, res) => {
    let order = await Order.findById(req.params.id).exec();
  
    await order.deleteOne();
  
    res.status(204).send();
    console.log("Ordine rimosso correttamente dal catalogo");
  });

  router.put("/:id", async (req, res) => {
    let order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    let orderId = order.id;
    console.log("Stato dell'ordine modificato correttamente");
    res
      .location("/api/v1/orders/" + orderId)
      .status(200)
      .send();
  });
module.exports = router;
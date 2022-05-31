const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");

// Importo il modello del prodotto dalla cartella models

const Order = require("./models/order");
const Product = require("./models/product");
const Cart = require("./models/cart").Cart;
const Cliente = require("./models/account").Cliente;
const tokenChecker = require("./tokenChecker");

router.post("", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Cliente" || user_type === "Admin") {
    const { customerId, status } = req.body;
    let data = null;
    let cart = await Cart.findOne({ userId: customerId });
    let customer = await Cliente.findById(customerId).populate(
      "shipping_address"
    );
    const product = await Product.findById(cart.items[0].productId);
    const orderData = {
      customerId: customerId,
      items: cart.items,
      subTotal: cart.subTotal,
      sellerId: product.userId,
      status: status,
      payment: customer.payment,
      shipping_address: customer.shipping_address,
    };
    let order = new Order(orderData);
    data = await order.save();
    console.log(order);
    return res.status(200).send({
      code: 200,
      message: "Order created successfully!",
      data: data,
    });
  }
});

router.get("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (
    user_type === "Venditore" ||
    user_type === "Admin" ||
    user_type === "Cliente"
  ) {
    let order = await Order.findById(req.params.id).populate(
      "shipping_address"
    );
    res.status(200).json({
      self: "/api/v2/orders/" + order.id,
      customerId: order.customerId,
      items: order.items,
      subTotal: order.subTotal,
      status: order.status,
      id: order.id,
      payment: order.payment,
      sellerId: order.sellerId,
      shipping_address: order.shipping_address,
    });
  }
});
router.get("/catalog/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Cliente" || user_type === "Admin") {
    let orders = await Order.find({ customerId: req.params.id });
    orders = orders.map((order) => {
      return {
        self: "/api/v2/orders/" + order.id,
        customerId: order.customerId,
        items: order.items,
        subTotal: order.subTotal,
        status: order.status,
        id: order.id,
        payment: order.payment,
        sellerId: order.sellerId,
        shipping_address: order.shipping_address,
      };
    });
    res.status(200).json(orders);
  }
});
router.get("/catalogv/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let orders = await Order.find({ sellerId: req.params.id });
    orders = orders.map((order) => {
      return {
        self: "/api/v2/orders/" + order.id,
        customerId: order.customerId,
        items: order.items,
        subTotal: order.subTotal,
        status: order.status,
        id: order.id,
        payment: order.payment,
        sellerId: order.sellerId,
        shipping_address: order.shipping_address,
      };
    });
    res.status(200).json(orders);
  }
});

router.delete("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (
    user_type === "Admin" ||
    user_type === "Cliente" ||
    user_type === "Venditore"
  ) {
    let order = await Order.findById(req.params.id).exec();

    await order.deleteOne();

    res.status(204).send();
    console.log("Ordine rimosso correttamente dal catalogo");
  }
});

router.put("/:id", tokenChecker, async (req, res) => {
  var user_type = req.userAccount;

  if (user_type === "Venditore" || user_type === "Admin") {
    let order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    let orderId = order.id;
    console.log("Stato dell'ordine modificato correttamente");
    res
      .location("/api/v2/orders/" + orderId)
      .status(200)
      .send();
  }
});
module.exports = router;

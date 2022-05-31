const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const products = require("./products.js");
const images = require("./images.js");
const shops = require("./shops.js");
const carts = require("./carts.js");
const orders = require("./orders.js");
const authentications = require("./authentications.js");

// Middleware per il parsing

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    //exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parte statica del frontend

app.use("/", express.static("static"));
app.use("/images", express.static("./images"));

// Routing delle risorse con il versioning delle API

app.use("/api/v1/authentications", authentications);
app.use("/api/v1/products", images, products);
app.use("/api/v1/shops", images, shops);
app.use("/api/v1/carts", carts);
app.use("/api/v1/orders", orders);
//...

// Handler per gli errori

app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;

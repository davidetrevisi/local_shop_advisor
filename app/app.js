const express = require("express");
const app = express();
const cors = require('cors');

const products = require("./products.js");
const images = require("./images.js");

// Middleware di express per il parsing

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parte statica del frontend

app.use("/", express.static("static"));
app.use('/images', express.static('./images'));

// Routing delle risorse con il versioning delle API

app.use("/api/v1/products", images, products);
//...

// Handler per gli errori

app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;

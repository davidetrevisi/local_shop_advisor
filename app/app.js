const express = require("express");
const app = express();

const products = require("./products.js");
const authentications = require("./authentications.js");

// Middleware di express per il parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parte statica del frontend

// app.use("/", express.static("static"));

// Routing delle risorse con il versioning delle API

app.use("/api/v1/products", products);

app.use("/api/v1/authentications", authentications);
//...

// Handler per gli errori

app.use((req, res) => {
  res.status(404);
  res.json({ error: "Not found" });
});

module.exports = app;

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product");
const Address = require("./account");

let ItemSchema = new Schema(
    {
        productId: {
            type: String
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less then 1."],
        },
        price: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Items", ItemSchema);
const OrderSchema = new Schema(
    {
        customerId: {
            type: String,
        },

        items: [ ItemSchema],

        subTotal: {
            default: 0,
            type: Number,
        },
        sellerId: {
            type: String,
        },
        status: {
            type: String,
        },
        payment: {
            type: String,
        },
        shipping_address: {
            type: Schema.Types.ObjectId,
            ref: "Address",
          },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Order", OrderSchema);
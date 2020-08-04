const mongoose = require('mongoose');

//Create the product Schema
const ProductSchema = new mongoose.Schema({
    productName: {
        type: String
    },
    productPrice: {
        type: String
    },
    productImage: {
        type: String
    },
    userId: {
        type: String
    }
});

//Create, instantiate and export the schema
const Products = mongoose.model("Product", ProductSchema);
module.exports = Products;
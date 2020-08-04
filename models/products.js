/*
 * Name: Thales Barros Fajardo Valente
 * Student ID: 200400698
 * Date: 07/06/2020
 * 
 * Description: Creation of the schema to hold the information for the products table
 */

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
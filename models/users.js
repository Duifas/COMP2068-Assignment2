/*
 * Name: Thales Barros Fajardo Valente
 * Student ID: 200400698
 * Date: 07/06/2020
 * 
 * Description: Creation of the schema to hold all the information from users
 */

const mongoose = require('mongoose');

//Create the user Schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
});
//Create, instantiate and export the schema
const Users = mongoose.model("User", UserSchema);
module.exports = Users;
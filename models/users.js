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
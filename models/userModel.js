const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    password : {
        type: 'String',
        required: true,
        trim: true
    }
});



module.exports = mongoose.model("User", userSchema);
 
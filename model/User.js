const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    }
},{timestamps: true});

const Users=mongoose.model("user",userSchema);

module.exports = Users;
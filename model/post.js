const mongoose = require('mongoose');
const { body } = require('express-validator');

const postSchema =new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required: true
    },
    image:{
        type: String,
        required:true
    },
    userName:{
        type: String,
        required: true
    }
},{ timestamps:true })

const Post= mongoose.model("post",postSchema);

module.exports = Post;
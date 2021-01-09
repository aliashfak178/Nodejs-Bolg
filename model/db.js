const mongoose = require('mongoose');

// mongodb connection
const connection=async ()=>{
    try{
        await mongoose.connect(process.env.DB,{ useNewUrlParser: true , useUnifiedTopology: true } );
        console.log("Mongodb Connected");
    }catch(err){
        console.log(error.massage);
    }
}

module.exports = connection;
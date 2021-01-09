const express=require('express');
const app=express();
const session= require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash= require('express-flash');
require('dotenv').config();
const connection = require('./model/db');
const userRoutes=require('./routes/userRoutes');
const profileRoutes= require('./routes/profileRoutes');
const postRouts= require('./routes/postRouts');
const PORT= process.env.PORT || 8080;

//connections
connection();

//Express session middlewere
const store=new MongoDBStore({
    uri: process.env.DB,
    collection: 'session'
});
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    store:store
  }));
// Flash middleware
app.use(flash());

app.use((req,res,next)=>{
    res.locals.message= req.flash();
    next();
})
// Load Static Files
app.use(express.static("./views"))
// Middle Ware
app.use(express.urlencoded({extended:true}))

// Set Ejs
app.set("view engine","ejs");

//Routes
app.use(userRoutes);
app.use(profileRoutes);
app.use(postRouts);

// Creating server
app.listen(PORT,()=>{
    console.log(`Server Are running at Port: ${PORT}`)
});
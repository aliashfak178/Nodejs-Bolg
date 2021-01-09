const {check,validationResult} =require('express-validator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const Users=require('../model/User');

const loadSignup = (req,res)=>{
    const title = 'Create New Account';
    const errors = []
    res.render("register",{title, errors, inputs: {},login:false })
}
const loadLogin= (req,res)=>{
    const title = "User Login";
    res.render("login",{title ,errors:[],inputs:{}, login:false})
}

const loginValidations = [
    check('email').not().isEmpty().withMessage(" Email is required"),
    check('password').not().isEmpty().withMessage("password is required")
];
const postLogin= async (req,res)=>{
    const {email,password} = req.body;
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        res.render("login",{title:'User Login', errors:errors.array(),inputs: req.body, login:false})
    }else{
        const checkEmil = await Users.findOne({email:email})
        if(checkEmil !== null){
            const id=checkEmil._id;
            const dbPassword= checkEmil.password;
            const passwordVarify= await bcrypt.compare(password,dbPassword);
            if(passwordVarify){
                    // Creating tokens
                const token = jwt.sign({userID:id},process.env.JWT_SECRET_KEY,{
                    expiresIn: "7d"
                });
                console.log("User Token",token);
                // Creating Session Variables
                req.session.user = token;
                res.redirect("/profile");
            }else{
                res.render("login",{title: 'User Login', errors:[{msg: 'Wrong Password'}],inputs: req.body , login:false})
            }
        }else{ 
            res.render("login",{title: 'User Login', errors:[{msg: 'Email is not Found'}],inputs: req.body ,login:false})
        }
    }
    
}

const registerValidations = [
    check('name').isLength({min:3}).withMessage('Name is require must be 3 charachters'),
    check('email').isEmail().withMessage("Valid Email is require"),
    check('password').isLength({min:6}).withMessage("password must be 6 charachter long")
];
const postRegister= async(req,res) =>{
    const {name,email,password} = req.body;
    const errors = validationResult(req); 
    if(!errors.isEmpty()){  
        const title = 'Create New Account';
        res.render("register", {title , errors: errors.array(), inputs: req.body, login:false})
    }else {
        try{
            const userEmail = await Users.findOne({ email});
            if(userEmail === null)
            {
                const salt = await bcrypt.genSalt(10)
                const hashed =await bcrypt.hash(password,salt);

                const newUser = new Users({
                    name: name,
                    email: email,
                    password: hashed
                });
                try{
                    const createdUser=await newUser.save();
                    req.flash('success',"your acoount has been created successfully");
                    res.redirect("/login");
                }catch(err){
                    console.log(err.message);
                }
            }else
            {
                res.render("register", {title:'Create New Accounr' , errors: [{msg:'Email is already exist'}], inputs: req.body, login:false})
            }
        }catch(err){
            console.log(err.message);
        }
    }
}

module.exports = {
    loadSignup,
    loadLogin,
    registerValidations,
    postRegister,
    postLogin,
    loginValidations
}
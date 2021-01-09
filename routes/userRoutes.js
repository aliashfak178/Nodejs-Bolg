const express=require('express');
const router= express.Router();
// userControllers
const userControllers= require('../controllers/userControllers');
const authMiddleware= require('../middlewares/auth');

// Routes
router.get("/",authMiddleware.stopLogin,userControllers.loadSignup);

router.get("/login",authMiddleware.stopLogin,userControllers.loadLogin);

router.post("/register",userControllers.registerValidations,userControllers.postRegister);

router.post("/postLogin",userControllers.loginValidations,userControllers.postLogin);

module.exports = router;

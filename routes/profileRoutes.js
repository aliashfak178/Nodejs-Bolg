const express=require('express');
const router= express.Router();

// profile Controllers
const profileControllers= require('../controllers/profileControllers');
const authMiddleware= require('../middlewares/auth');

router.get("/profile",authMiddleware.auth,profileControllers.profile);
router.get("/logout",profileControllers.logout);

module.exports = router;
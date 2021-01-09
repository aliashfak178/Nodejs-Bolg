const express=require('express');
const router= express.Router();
const postForm= require("../controllers/postsController");
const authMiddleware= require('../middlewares/auth');

router.get("/createPost",authMiddleware.auth,postForm.postForm);
router.post('/createPost',authMiddleware.auth,postForm.storePost);
router.get("/post/:page",authMiddleware.auth,postForm.posts);
router.get("/details/:id",authMiddleware.auth,postForm.details);
router.get("/update/:id",authMiddleware.auth,postForm.updateForm);
router.post("/update",[postForm.postValidations,authMiddleware.auth],postForm.postUpdate);
router.post("/delete",authMiddleware.auth,postForm.deletePost);

module.exports= router;
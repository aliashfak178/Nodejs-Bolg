const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs=require('fs');
const {check,validationResult} =require('express-validator');
const User= require('../model/User')
const Post= require('../model/post');
const dateFormat = require('dateformat');

const postForm= (req,res)=>{
    res.render('createPost',{titles:'Create New Post',login: true,error:[],title:'',body:''});
};

const storePost=(req,res)=>{
    const form = formidable();
    form.parse(req, (err, fields, files) => {
            const error= [];
            const {title, body} = fields;
            if(title.length === 0){
                error.push({msg:'Title is required'});
            }
            if(body.length === 0){
                error.push({msg: 'Body is required'});
            }
            const imageName= files.Image.name;
            const split = imageName.split(".");
            const imageExt = split[split.length - 1].toUpperCase();
            if(files.Image.name.length === 0){
                error.push({msg: 'Image is required'});
            }else if(imageExt !== "JPG" && imageExt !== "PNG"){
                error.push({msg: 'Only jpg and png are allowed'});
            }
            if(error.length !==0){
                res.render('createPost',{title:'Create New Post',login: true, error,title,body});
            }else{
                files.Image.name = uuidv4() + "." + imageExt;
                const oldPath= files.Image.path;
                const newPath= __dirname + "/../views/assets/img/" + files.Image.name;
                fs.readFile(oldPath,(err,data) =>{
                    if(!err){
                        fs.writeFile(newPath,data, (err)=>{
                            if(!err){
                                fs.unlink(oldPath, async (err)=>{
                                    if(!err){
                                        const id=req.id;
                                        try{
                                            const user=await User.findOne({_id:id});
                                            const name=user.name;
                                            const newPost =new Post({
                                                userId: id,
                                                title,
                                                body,
                                                image: files.Image.name,
                                                userName: name
                                            });
                                            try{
                                                const result= await newPost.save();
                                                if(result){
                                                    req.flash('success',"your Post added successfully");
                                                    res.redirect('/post/1')
                                                }
                                            }catch(err){
                                                res.send(err.message);
                                            }
                                        }catch(err){
                                            res.send(err.message);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

            
        });
}

const posts= async (req,res)=>{
    const id= req.id;
    let currantPage = 1;
    const page = req.params.page;
    if(page){
        currantPage = page;
    }
    const perPage=4;
    const skip = (currantPage - 1) * perPage;

    const allPost= await Post.find({userId:id}).skip(skip).limit(perPage).sort({updatedAt: -1});
    const countPost = await Post.find({userId: id}).countDocuments();

    res.render("post",{title:"Posts",login:true,posts:allPost,formate:dateFormat,count:countPost,perPage,currantPage});
}

const details = async(req,res)=>{
    const id= req.params.id;
    const details = await Post.findOne({_id:id});
    res.render('details',{title:'post Details',login: true,details});
}

const updateForm = async (req,res)=>{
    const id= req.params.id;
    try{
        const post = await Post.findOne({_id:id});
        res.render('update',{title: 'Update Post',login:true,errors: [], post});
    }catch(err){
        res.send(err.message);
    }
}

const postValidations =[
    check('title').not().isEmpty().withMessage('Title is required'),
    check('body').not().isEmpty().withMessage('Body is required')
]
const postUpdate = async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
            const id = req.body.hiddenID;
            const post = await Post.findOne({ _id : id});
            res.render('update',{title: 'Update Post',login:true,errors: error.array(),post});            
    }else {
        const {hiddenID, title, body} = req.body;
        try{
            const updateResult= await Post.findByIdAndUpdate(hiddenID,{title,body});
            if(updateResult){
                req.flash('success',"your Post has been updated successfully");
                res.redirect('/post/1');
            }

        }catch(err){
            res.send(err.message);
        }
    }
}

const deletePost = async(req, res) =>{
        const id = req.body.deleteID;
        try{
            const delereResponse = await Post.findByIdAndRemove(id);
            if(delereResponse){
                req.flash('success',"your Post has been updated successfully");
                res.redirect('/post/1');
            }
        }catch(err){
            res.send(err.message);
        }
}

module.exports ={
    postForm,
    storePost,
    posts,
    details,
    updateForm,
    postUpdate,
    postValidations,
    deletePost
}  
const Users = require('../model/User');

const profile= async(req,res)=>{
    const id= req.id;
    const user= await Users.findOne({_id: id});
    res.render('profile',{title:'Profile',login: true,user});
};

const logout= (req,res) =>{
    req.session.destroy((err)=>{
        if(!err){
            res.redirect('/login')
        }
    });
}

module.exports = {
    profile,
    logout
}
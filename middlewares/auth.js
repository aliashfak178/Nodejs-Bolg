const jwt=require('jsonwebtoken');

const auth= (req,res,next)=>{
    if(req.session.user){
        const token=req.session.user;
        const verifyed=jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!verifyed)
        {
            return res.redirect('/login');
        }else{
            req.id = verifyed.userID;
        }
    }else{
        return res.redirect('/login');
    }
    next();
};

const stopLogin = (req, res, next) =>{
    if(req.session.user){
        const token=req.session.user;
        const verifyed=jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(verifyed)
        {
            return res.redirect('/profile');
        }
    }
    next();
};

module.exports = {
    auth,
    stopLogin
};
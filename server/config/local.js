module.exports = (req,res,next) =>{
    res.locals.user = req.user?req.user.get({plain:true}):null;
    next();
}
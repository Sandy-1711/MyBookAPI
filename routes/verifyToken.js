const jwt=require('jsonwebtoken');
const verifyToken=function(req,res,next)
{
    const authHeader=req.headers.token;
    if(authHeader)
    {
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SEC,function(err,user)
        {
            if(err)
            {
                return res.status(401).json({message:'Invalid Token'})
            }
            req.user=user;
            next();
        });
    }
    else
    {
        return res.status(401).json("Not authenticated")
    }
}
const verifyTokenAndAuthorization=function(req,res,next)
{
    verifyToken(req,res,function()
    {
        if(req.user.id===req.params.id)
        {
            next();
        }
        else
        {
            return res.status(403).json("You are not authorised");
        }
    })
}
const verifyTokenAndAdmin=function(req,res,next)
{
    verifyToken(req,res,function(){
        if(req.user.isAdmin===true)
        {
            next();
        }
        else {
            return res.status(403).json("You are not authorised");
        }
    })
}
module.exports={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};
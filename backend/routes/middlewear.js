const JWT_SECRET = require("../config")
const jwt = require("jwtwebtoken")

const authMiddleWare = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader|| authHeader.startsWith('Bearer')){
        return res.status(403).json({message:"No Bearer Token"})
    }

    try{
        const token = authHeader.split(' ')[1];

        const deciphered = jwt.verify(token,JWT_SECRET);
    
        const userId = deciphered.userId;
        next()
    }catch(err){
        return res.status(403).json({message:"Error occured in the AuthMiddleWare"})
    }
}


module.exports =  {
    authMiddleWare
}
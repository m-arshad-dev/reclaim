const { verifyAccessToken } = require("../utils/jwt");

function authenticate(req,res,next){

  const authHeader = req.headers.authorization;

  if(!authHeader) return res.status(401).json(
    {error:"Authentication Required"});

  const token = authHeader.split(" ")[1];

  try{

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();

  }catch(err){

    return res.status(401).json(
        {error:"Invalid or expired token"});

  }

}

module.exports = authenticate;
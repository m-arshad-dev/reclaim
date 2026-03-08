function authorize(...roles) {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        error: "Access denied"
      });

    }

    next();

  };

}
function authorizeAdmin(req,res,next){

  if(!req.user.is_admin){

    return res.status(403).json({
      error:"Admin access required"
    });

  }

  next();

}

module.exports = {
    authorize,
    authorizeAdmin
}
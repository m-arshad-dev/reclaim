const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 10, // limit each IP to 10 requests

  message: {
    success:false,
    message:"Too many requests. Try again later."
  },

  standardHeaders:true,
  legacyHeaders:false

});
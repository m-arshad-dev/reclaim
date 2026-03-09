const authService = require("../services/authService");

class AuthController {

  async login(req, res) {
    try {

      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.json(result);

    } catch (err) {

      res.status(400).json({
        error: err.message
      });

    }
  }


  async refresh(req ,res) {
    try {
        const {refreshToken} = req.body;

        const token = await authService.refresh(refreshToken);
        res.json(token)
    }catch(err){
        res.status(401).json({
            err: err.message
        });
    }
  }

  async logout(req , res){
    try {
        const {refreshToken} = req.body;

        const result = await authService.logout(refreshToken);

        res.json(result)
    }catch(err){
        res.status(400).json({
            err:err.message
        })
    }
  }

  async verifyEmail(req ,res){
    try {

        const {token}= req.body;
        const user = await authService.verifyEmail(token);
        res.json({
            message:"email verified Successfully",
            user
        })
    }catch(err){
      res.status(400).json({
        error: err.message
      });
    }
  }
    async changePassword(req, res){
    try {
      console.log("body:", req.body)
      const {currentPassword , newPassword} = req.body;
      if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both passwords required" });
  }  
      const result = await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.json(result)
    }catch(err){
      res.status(400).json({
        error:err.message
      })
    }
  }
  async forgotPassword(req ,res){
    try {
      const {email} = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result)
    }catch(err){
      res.status(400).json({
        error: err.message
      })
    }
  }

  async resetPassword(req,res){

  try{

    const { token,newPassword } = req.body;

    const result = await authService.resetPassword(
      token,
      newPassword
    );

    res.json(result);

  }catch(err){

    res.status(400).json({ error: err.message });

  }

}
}

module.exports = new AuthController();
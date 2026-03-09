
const userService = require("../services/UserService");

class UserController {

  async register(req, res) {
    try {

      const user = await userService.register(req.body);

      res.status(201).json({
        success: true,
        data: user
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }

  async login(req, res) {

    try {

      const { phone, password } = req.body;

      const user = await userService.login(phone, password);

      res.json({
        success: true,
        data: user
      });

    } catch (err) {

      res.status(401).json({
        success: false,
        message: err.message
      });

    }
  }

  async me(req , res) {
    try {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
    }catch(err){
      res.status(400).json({
        err: err.message
      })
    }
  }


}

module.exports = new UserController();
const userRepo = require("../repositories/userRepository");
const { hashPassword, comparePassword } = require("../utils/hash");
const {generateToken} = require("../utils/token");

class UserService {

  async register(data) {

    const existing = await userRepo.findByEmail(data.email);

    if (existing) {
      throw new Error("Email already registered");
    }

    const hash = await hashPassword(data.password);

    const verificationToken = generateToken(16);
    const expires = new Date(Date.now() + 24*60*60*1000);

    const user = await userRepo.create({
      full_name: data.full_name,

      email: data.email,
      password_hash: hash,
      email_verification_token: verificationToken,
      email_verification_expires: expires
    });

    //TODO: Send Email With Token (using email serivces)
    console.log("Send verification link:", `https://reclaim.pk/auth/verify-email?token=${verificationToken}`);

    return user;
  }

  async getProfile(id) {

    const user = await userRepo.findById(id);
    if (!user){
      throw new Error("User not found")
    }

    return user;

  }

  async updateProfile(id, data) {
    return userRepo.updateProfile(id, data);
  }



}

module.exports = new UserService();
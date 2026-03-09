const userRepo = require("../repositories/userRepository");
const { comparePassword, hashPassword } = require("../utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/jwt");

class AuthService {

  async login(email, password) {

    const user = await userRepo.findByEmail(email);

    if (!user) throw new Error("Invalid Credentials");

    const valid = await comparePassword(password, user.password_hash);

    if (!valid) throw new Error("Invalid Credentials");

    const accessToken = generateAccessToken({
      id: user.id,
      is_admin: user.is_admin
    });

    const refreshToken = generateRefreshToken({
      id: user.id
    });

    await userRepo.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken) {

    if (!refreshToken){
        throw new Error("Refresh token is required");
    }
    let decoded;

    try {
        decoded = verifyRefreshToken(refreshToken);
    }catch(err){
        throw new Error("Invalid refresh token");
    }
    const user = await userRepo.findByRefreshToken(refreshToken);

    if (!user) throw new Error("Invalid refresh token");

    const newAccess = generateAccessToken({
      id: user.id,
      is_admin: user.is_admin
    });

    return { accessToken: newAccess };
  }

  async verifyEmail(token) {
    const user = await userRepo.verifyEmail(token);

    if (!user){
        throw new Error("Invalid or expired verification token")
    }
    return user;
  }
  async logout(refreshToken){

    if (!refreshToken){
        throw new Error("Refresh token required");
    }
    const result = await userRepo.removeRefreshToken(refreshToken);

    if (!result){
        throw new Error("Invalid refresh token");
    }

    return {
        message:"logged out Successfully"
    };
  }
    async changePassword(userId , currentPassword ,newPassword){
    console.log("New password:", newPassword); 
    const user = await userRepo.findById(userId);

    if (!user){
      throw new Error("User not found");
    }
    if (!currentPassword){
      console.log("current")
    }
    if (!user.password_hash){
      console.log(hash , "dhdlkf")
    }
    const valid = await comparePassword(currentPassword , user.password_hash);
    console.log("vlaid")
    if (!valid){
      throw new Error("Current password Incorrect");
    }
    const hash =await hashPassword(newPassword)
      console.log("Hash:", hash);
    await userRepo.updatePassword(userId , hash);

    return {
      message: "Password updated Successfully"
    }

  }

}

module.exports = new AuthService();
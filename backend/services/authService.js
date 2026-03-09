const userRepo = require("../repositories/userRepository");
const { comparePassword, hashPassword } = require("../utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const {generateToken} = require('../utils/token')
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
  async forgotPassword(email){
    const token = generateToken(16);

    const expires = new Date(Date.now()+ 3600000)

    const user = await userRepo.setResetToken(
      email ,
      token ,
      expires
    );

    if (!user){
      throw new Error("User not foud")
    }
  console.log(
   `Reset link: https://reclaim.pk/reset-password?token=${token}`
  );

  return { message:"Password reset email sent" };
  }

  async resetPassword(token,password){

  const hash =  hashPassword(password)

  const user = await userRepo.resetPassword(
    token,
    hash
  );

  if(!user){
    throw new Error("Invalid or expired reset token");
  }

  return { message:"Password reset successful" };

}
}

module.exports = new AuthService();
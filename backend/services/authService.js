const userRepo = require("../repositories/userRepository");
const { comparePassword } = require("../utils/hash");
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

}

module.exports = new AuthService();
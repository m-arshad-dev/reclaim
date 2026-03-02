const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');

class UserService {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userRepository.create({
      ...userData,
      password_hash: hashedPassword
    });
    return user;
  }

  async getUserByPhone(phone) {
    return userRepository.findByPhone(phone);
  }
}

module.exports = new UserService();
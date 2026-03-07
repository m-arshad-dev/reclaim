const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

class UserService {

  async register(data) {

    const existingUser = await userRepository.findByPhone(data.phone_number);

    if (existingUser) {
      throw new Error("Phone number already registered");
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
      full_name: data.full_name,
      phone_number: data.phone_number,
      email: data.email,
      password_hash: hash
    });

    return user;
  }

  async login(phone, password) {

    const user = await userRepository.findByPhone(phone);

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

}

module.exports = new UserService();
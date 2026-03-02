const pool = require('../db');

class UserRepository {
  async create(user) {
    const query = 'INSERT INTO users(full_name, phone_number,email ,password_hash) VALUES ($1, $2, $3) RETURNING *';
    const values = [user.full_name, user.phone_number,user.email , user.password_hash];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone_number = $1';
    const { rows } = await pool.query(query, [phone]);
    return rows[0];
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = new UserRepository();
const db = require('../db');

class UserRepository {

  async createUser(user) {
    const query = `
      INSERT INTO users (full_name, phone_number, email, password_hash)
      VALUES ($1,$2,$3,$4)
      RETURNING id, full_name, phone_number, email, created_at
    `;

    const values = [
      user.full_name,
      user.phone_number,
      user.email,
      user.password_hash
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async findByPhone(phone) {
    const query = `
      SELECT * FROM users
      WHERE phone_number = $1
    `;

    const { rows } = await db.query(query, [phone]);
    return rows[0];
  }

  async findByEmail(email) {
    const query = `
      SELECT * FROM users
      WHERE email = $1
    `;

    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  async findById(id) {
    const query = `
      SELECT id, full_name, phone_number, email, trust_score, created_at
      FROM users
      WHERE id = $1
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  async verifyUser(id) {
    const query = `
      UPDATE users
      SET is_verified = TRUE
      WHERE id = $1
      RETURNING id, is_verified
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

}

module.exports = new UserRepository();
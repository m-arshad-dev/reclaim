const db = require('../db');

class UserRepository {

  async create(user) {
    const query = `
      INSERT INTO users
      (full_name,email,password_hash,email_verification_token,email_verification_expires)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id, full_name, email, is_verified, created_at
    `;
    const { rows } = await db.query(query, [
      user.full_name,

      user.email,
      user.password_hash,
      user.email_verification_token,
      user.email_verification_expires
    ]);
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
    const { rows } = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT id,full_name,email,is_verified,trust_score,is_admin, password_hash
       FROM users WHERE id=$1`,
      [id]
    );
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
async verifyEmail(token) {
  const { rows } = await db.query(
    `UPDATE users
     SET is_verified = TRUE,
         email_verification_token = NULL,
         email_verification_expires = NULL
     WHERE email_verification_token = $1
     AND email_verification_expires > NOW()
     RETURNING id, full_name, email, is_verified`,
    [token]
  );

  return rows[0];
}

  async updateRefreshToken(id, token) {
    await db.query(
      `UPDATE users SET refresh_token=$2 WHERE id=$1`,
      [id, token]
    );
  }

  async findByRefreshToken(token) {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE refresh_token=$1`,
      [token]
    );

    return rows[0];
  }

  async updateProfile(id, data) {
    const { rows } = await db.query(
      `UPDATE users
       SET full_name = COALESCE($2,full_name),
           email = COALESCE($3,email)
       WHERE id=$1
       RETURNING id,full_name,email`,
      [id, data.full_name, data.email]
    );

    return rows[0];
  }

  async changePassword(id, hash) {
    await db.query(
      `UPDATE users SET password_hash=$2 WHERE id=$1`,
      [id, hash]
    );
  }
async removeRefreshToken(token){

  const {rows}= await db.query(
      `UPDATE users
  SET refresh_token = null
  WHERE refresh_token = $1
  RETURNING id`,[token]
  );

  return rows[0];
}
async updatePassword(id, hash) {
  const result = await db.query(
    `UPDATE users
     SET password_hash = $2
     WHERE id = $1`,
    [id, hash]
  );

  if (result.rowCount === 0) {
    throw new Error("User not found or password not updated");
  }

  return result.rowCount;
}

}

module.exports = new UserRepository();
const pool = require('../db');
class LostFoundRepository {
  async createItem(item) {
    const { user_id, category_id, location_id, title, description, image_url, status } = item;
    const result = await pool.query(
      `INSERT INTO items (user_id, category_id, location_id, title, description, image_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, category_id, location_id, title, description, image_url, status]
    );
    return result.rows[0];
  }

  async getItems(filters, limit = 50) {
    const { title, description, category_id, location_id, status } = filters;

    const result = await pool.query(
      `SELECT i.id, i.title, i.description, i.image_url, i.status, l.city, i.created_at
       FROM items i
       LEFT JOIN locations l ON i.location_id = l.id
       WHERE i.is_active = TRUE
         AND ($1::text IS NULL OR i.title ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR i.description ILIKE '%' || $2 || '%')
         AND ($3::int IS NULL OR i.category_id = $3)
         AND ($4::int IS NULL OR i.location_id = $4)
         AND ($5::item_status IS NULL OR i.status = $5)
       ORDER BY i.created_at DESC
       LIMIT $6`,
      [title || null, description || null, category_id || null, location_id || null, status || null, limit]
    );

    return result.rows;
  }

  async getItemById(id) {
    const result = await pool.query(
      `SELECT i.id, i.title, i.description, i.image_url, i.status, l.city, i.created_at
     FROM items i
     LEFT JOIN locations l ON i.location_id = l.id
     WHERE i.id = $1`,
      [id]
    );

    return result.rows[0];
  }

  async updateItem(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in data) {
      fields.push(`${key} = $${idx}`);
      values.push(data[key]);
      idx++;
    }

    values.push(id); // last param = id

    const query = `UPDATE items SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  // Get single lost item by ID and status
  async getItemByIdAndStatus(id, status) {
    const result = await pool.query(
      `SELECT i.id, i.title, i.description, i.image_url, i.status, l.city, i.created_at
     FROM items i
     LEFT JOIN locations l ON i.location_id = l.id
     WHERE i.id = $1 AND i.status = $2 AND i.is_active = TRUE`,
      [id, status]
    );
    return result.rows[0];
  }

  // Update item with status check (optional, for extra safety)
  async updateItemWithStatus(id, data, status) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in data) {
      fields.push(`${key} = $${idx}`);
      values.push(data[key]);
      idx++;
    }

    values.push(id);      // last param = id
    values.push(status);  // param for status check

    const query = `UPDATE items SET ${fields.join(', ')} WHERE id = $${idx} AND status = $${idx + 1} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async deleteItem(id) {
    const result = await pool.query(
      `UPDATE items SET is_active = FALSE WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new LostFoundRepository();
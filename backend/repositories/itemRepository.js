const db = require('../db');

class ItemRepository {
    async create({ userId, title, description, status, category_id, location_id, image_url }) {
        if (category_id) {
            const categ = await db.query(
                `SELECT id FROM categories WHERE id = $1`,
                [parseInt(category_id)]
            );
            if (categ.rowCount === 0) throw { status: 400, message: "category_id does not exist" };
        }

        if (location_id) {
            const log = await db.query(
                `SELECT id FROM locations WHERE id = $1`,
                [parseInt(location_id)]
            );
            if (log.rowCount === 0) throw { status: 400, message: "location_id does not exist" };
        }
        const { rows } = await db.query(
            `INSERT INTO items(user_id, title, description, status, category_id, location_id, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING user_id, title, description, status, image_url, category_id, location_id, is_active, created_at`,
            [
                userId,
                title.trim(),
                description.trim(),
                status,
                category_id ? parseInt(category_id) : null,
                location_id ? parseInt(location_id) : null,
                image_url,
            ]
        );
        return rows[0];
    }
async getAllCategories() {
    const result = await db.query(
      `SELECT id, name FROM categories ORDER BY id DESC`
    );
    return result.rows;
  }

  async getAllLocations() {
    const result = await db.query(
      `SELECT id, city FROM locations ORDER BY id DESC`
    );
    return result.rows;
  }

    async getRecentItems(limit) {
        const result = await db.query(
            `SELECT 
                i.id,
                i.title,
                i.image_url,
                i.status,
                l.city,
                i.created_at
            FROM items i
            LEFT JOIN locations l ON i.location_id = l.id
            WHERE i.is_active = TRUE
            ORDER BY i.created_at DESC
            LIMIT $1`,
            [limit]
        );
        return result.rows;
    }

    async searchByTitle(query, limit) {
        const result = await db.query(
            `SELECT 
                i.id,
                i.title,
                i.image_url,
                i.status,
                l.city,
                i.created_at
            FROM items i
            LEFT JOIN locations l ON i.location_id = l.id
            WHERE i.is_active = TRUE
            AND i.title ILIKE $1
            ORDER BY i.created_at DESC
            LIMIT $2`,
            [`%${query}%`, limit]
        );
        return result.rows;
    }

    async getItemsByUser(userId) {
        const result = await db.query(
            `SELECT 
                id,
                title,
                image_url,
                status,
                created_at
            FROM items
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    async getItemById(itemId) {
        const result = await db.query(
            `SELECT 
                i.id,
                i.title,
                i.description,
                i.image_url,
                i.status,
                i.created_at,
                l.city
            FROM items i
            LEFT JOIN locations l ON i.location_id = l.id
            WHERE i.id = $1`,
            [itemId]
        );
        return result.rows[0];
    }

    async getItems({ status = null, categoryId = null, locationId = null, city = null, limit = 20, offset = 0 } = {}) {
        const conditions = ['i.is_active = TRUE'];
        const values = [];
        let paramIndex = 1;

        if (status) {
            conditions.push(`i.status = $${paramIndex++}`);
            values.push(status);
        }
        if (categoryId) {
            conditions.push(`i.category_id = $${paramIndex++}`);
            values.push(categoryId);
        }
        if (locationId) {
            conditions.push(`i.location_id = $${paramIndex++}`);
            values.push(locationId);
        }
        if (city) {
            conditions.push(`l.city ILIKE $${paramIndex++}`);
            values.push(`%${city}%`);
        }

        values.push(limit, offset);

        // ✅ Fix 4: alias changed from 'x' to 'c', fixed typo 'cegrory_id' → 'category_id'
        // ✅ Fix 5: pool.query → db.query
        const query = `
            SELECT
                i.id, i.userid, i.title, i.description, i.image_url, i.status,
                i.is_active, i.created_at, i.updated_at,
                c.name AS category_name, l.city AS location_city
            FROM items i
            LEFT JOIN categories c ON c.id = i.category_id
            LEFT JOIN locations l ON i.location_id = l.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY i.created_at DESC
            LIMIT $${paramIndex++} OFFSET $${paramIndex}`;

        const { rows } = await db.query(query, values);
        return rows;
    }
}

module.exports = new ItemRepository();
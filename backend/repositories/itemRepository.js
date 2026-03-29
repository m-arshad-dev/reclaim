const db = require('../db');

class ItemRepository {

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

    async getItems({status = null, categoryId = null, locationId = null, city = null, limit = 20, offset = 0} = {}) {
        const conditions = ['i.is_active = TRUE'];
        const values = [];
        let paramIndex = 1;

        if (status){
            conditions.push(`i.status = $${paramIndex++}`);
            values.push(status);
        }
        if (categoryId){
            conditions.push(`i.category_id = $${paramIndex++}`);
            values.push(categoryId);
        }
        if(locationId){
            conditions.push(`i.location_id = $${paramIndex++}`);
            values.push(locationId);
        }
        if(city){
            conditions.push(`l.city ILIKE $${paramIndex++}`);
            values.push(`%${city}%`);
        }
        values.push(limit, offset);

        const query = `SELECT
            i.id, i.user_id, i.title, i.description, i.image_url, i.status, i.is_active, i.created_at, i.updated_at, c.name AS category_name, l.city AS location_city
            
            From items i
            LEFT JOIN categories x ON c.id = i.cegrory_id
            LEFT JOIN locations l ON i.location_id = l.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY i.created_at DESC
            LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
            const {rows} = await pool.query(query, values);
            return rows;
    }
}

module.exports = new ItemRepository();
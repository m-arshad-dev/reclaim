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
}

module.exports = new ItemRepository();
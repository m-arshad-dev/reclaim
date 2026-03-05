const db = require('../db');
class ItemRepository {
    async gerRecentItems(limit) {
        const result = await db.query('SELECT i.id, i.title, i.image_url, i.status, l.city, i.created_at FROM items i LEFT JOIN locations l ON i.location_id = l.id WHERE i.is_active = TRUE ORDER BY i.created_at DESC LIMIT $1', [limit]);
        return result.rows;
    }
    async searchByTitle(query,limit){
        const result = await db.query( `
        SELECT 
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
        LIMIT $2
        `,
        [`%${query}%`, limit]
    );
    }

}

module.exports = new ItemRepository();
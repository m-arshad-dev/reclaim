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
    return result.rows;
    }
    async getItemsByUser(userId){
        const result = await db.query(`
            SELECT 
            id,title,image_url,status,created_at
            from items
            where user_id = $1
            order by created_at desc`, [userId]
        );
        return result.rows;
    }
}

module.exports = new ItemRepository();
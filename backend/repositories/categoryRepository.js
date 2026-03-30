const pool = require('../db');
class CategoryRepository {
    async getAllCategories(){
        const query = `
        Select id, name from categories order by name asc`;
        const {rows} = await pool.query(query);
        return rows;
    }
}
module.exports = new CategoryRepository();
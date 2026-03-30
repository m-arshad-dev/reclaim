const pool = require('../db');

class LocationRepositroy {

    async getAllCities (){
        const query =`
        select distinc city from locations order by city asc`;
        const {rows} = await pool.query(query);
        return rows.map(r => r.city);
    }
}

module.exports = new LocationRepositroy();
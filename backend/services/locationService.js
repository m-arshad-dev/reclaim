const locationService = require('../repositories/locationRepository');

class LocationService {
    async getAllCities(){
        return await locationService.getAllCities();
    }
}

module.exports = new LocationService();
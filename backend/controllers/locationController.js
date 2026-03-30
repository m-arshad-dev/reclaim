const locationService = require('../services/locationService');

class LocationController{
    async getAllCities (req, res){
        try {
            const cities = await locationService.getAllCities();
            res.status(200).json({
                success: true,
                data: cities
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new LocationController();
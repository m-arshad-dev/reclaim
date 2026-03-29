const itemService = require('../services/itemService');

class ItemController {

    async getRecentItems(req, res) {
        try {
            const items = await itemService.getHomePageRecentItems();
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async searchItems(req, res) {
        try {
            const { query } = req.query;
            const items = await itemService.searchItemsByTitle(query);
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMyPosts(req, res) {
        try {
            const items = await itemService.getUserItems(req.params.userId);
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getItemDetails(req, res) {
        try {
            const item = await itemService.getItemDetails(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getItems(req, res) {
        try{
            const { status, categoryId, locationId, city, limit, offset } = req.query;
            const items = await itemService.getItems({status, categoryId, locationId, city, limit, offset});
            res.status(200).json({
                success: true,
                data: items,
                count: items.length
            });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ItemController();
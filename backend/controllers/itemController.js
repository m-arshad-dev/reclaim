const itemService = require('../services/itemService');
class ItemController{
    async getRecentItems(req, res){
        try{
            const items = await itemService.getHomePageRecentItems();
            res.status(200).json(items);
        } catch (error){
            res.status(500).json({message : error.message});
        }
    }

    async searchItems(req, res){
        try{
            const {query} = req.query;
            const items = await itemService.searchItemsByTitle(query);
            res.status(200).json(items);
        } catch (error){
            res.status(500).json({message : error.message});
        }
    }

    async getMyPosts(req, res){
        try {
            const userId = req.params.userId;
            const items = await itemService.getUserItems(userId);
            res.status(200).json(items);
        }catch(error){
            res.status(500).json({message : error.message});
        }
    }
}

module.exports = new ItemController();
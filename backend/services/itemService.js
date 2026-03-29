const itemRepository = require('../repositories/itemRepository');
const VALID_STATUSES = ['lost', 'found'];

class ItemService{
    async getHomePageRecentItems(){
        const limit = 8;
        return await itemRepository.getRecentItems(limit);
    }
    async searchItemsByTitle(searchText){
        const limit = 10;
        return await itemRepository.searchByTitle(searchText,limit);
    }
    async getUserItems(userId){
        return await itemRepository.getItemsByUser(userId);
    }
    async getItems({status, categoryId, locationId, city, limit, offset}){
        if(status && !VALID_STATUSES.includes(status)){
            throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
        }
        return await itemRepository.getItems({status, categoryId, locationId, city, limit: parseInt(limit) || undefined, offset: parseInt(offset) || undefined});
    }
}
module.exports = new ItemService();
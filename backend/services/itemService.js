const itemRepository = require('../repositories/itemRepository');
class ItemService {
    async getHomePageRecentItems() {
        const limit = 8;
        return await itemRepository.getRecentItems(limit);
    }
    async searchItemsByTitle(searchText) {
        const limit = 10;
        return await itemRepository.searchByTitle(searchText, limit);
    }
    async getUserItems(userId) {
        return await itemRepository.getItemsByUser(userId);
    }

    // ⭐ ADD THIS FUNCTION
    async getItemDetails(id) {
        return await itemRepository.getItemById(id);
    }
}
module.exports = new ItemService();
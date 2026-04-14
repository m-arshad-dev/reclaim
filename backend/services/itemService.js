const itemRepository = require('../repositories/itemRepository');
const VALID_STATUSES = ['lost', 'found'];

class ItemService {
    async createItem({ userId, title, description, status, category_id, location_id, imageUrl }) {
    return await itemRepository.create({
      userId,
      title,
      description,
      status,
      category_id,
      location_id,
      imageUrl,
    });
  }
 async getAllCategories() {
    return await itemRepository.getAllCategories();
  }

  async getAllLocations() {
    return await itemRepository.getAllLocations();
  }
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
}
module.exports = new ItemService();
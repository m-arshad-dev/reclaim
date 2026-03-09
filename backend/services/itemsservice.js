const itemsRepository = require("../repositories/itemRepository");

class ItemsService {

  async createFoundItem(userId, body) {
    const itemData = {
      user_id: userId,
      category_id: body.category_id,
      location_id: body.location_id,
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      status: "found"
    };

    return await itemsRepository.createItem(itemData);
  }

  async createLostItem(userId, body) {
    const itemData = {
      user_id: userId,
      category_id: body.category_id,
      location_id: body.location_id,
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      status: "lost"
    };

    return await itemsRepository.createItem(itemData);
  }

  async getLostItems(filters) {
    return await itemsRepository.getItemsByStatus("lost", filters);
  }

  async getFoundItems(filters) {
    return await itemsRepository.getItemsByStatus("found", filters);
  }

}

module.exports = new ItemsService();
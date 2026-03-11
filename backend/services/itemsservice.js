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
 async getLostItems(filters) {
    return await itemsRepository.getItemsByStatus("lost", filters);
  }
  // Get single lost item by ID
async getLostItemById(itemId) {
  return await itemsRepository.getItemByIdAndStatus(itemId, "lost");
}
// Update lost item
async updateLostItem(itemId, body) {
  return await itemsRepository.updateItem(itemId, body, "lost");
}
// Upload image for lost item
async uploadLostItemImage(itemId, file) {
  const imageUrl = file.path; // assuming multer
  return await itemsRepository.updateItem(itemId, { image_url: imageUrl }, "lost");
}
//-----------------------------------------
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
  async getFoundItems(filters) {
    return await itemsRepository.getItemsByStatus("found", filters);
  }

// Get single found item by ID
async getFoundItemById(itemId) {
  return await itemsRepository.getItemByIdAndStatus(itemId, "found");
}

// Update found item
async updateFoundItem(itemId, body) {
  return await itemsRepository.updateItem(itemId, body, "found");
}

// Delete item
async deleteItem(itemId) {
  return await itemsRepository.deleteItem(itemId);
}
// Upload image for found item
async uploadFoundItemImage(itemId, file) {
  const imageUrl = file.path;
  return await itemsRepository.updateItem(itemId, { image_url: imageUrl }, "found");
}
}

module.exports = new ItemsService();
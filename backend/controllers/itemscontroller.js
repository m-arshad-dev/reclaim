const itemsService = require("../services/itemsservice");

class ItemsController {
  async createLost(req, res) {
    try {
      const userId = req.user.id; // from auth middleware
      const item = await itemsService.createLostItem(userId, req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getLost(req, res) {
    try {
      const items = await itemsService.getLostItems(req.query);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
    // Get single lost item by ID
async getLostById(req, res) {
  try {
    const itemId = req.params.id;
    const item = await itemsService.getLostItemById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Update lost item
async updateLost(req, res) {
  try {
    const itemId = req.params.id;
    const updatedItem = await itemsService.updateLostItem(itemId, req.body);
    if (!updatedItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Upload image for lost item
async uploadLostImage(req, res) {
  try {
    const itemId = req.params.id;
    const file = req.file; // assuming you use multer middleware
    const updatedItem = await itemsService.uploadLostItemImage(itemId, file);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//-----------------------------------------------
  async createFound(req, res) {
    try {
      const userId = req.user.id;
      const item = await itemsService.createFoundItem(userId, req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getFound(req, res) {
    try {
      const items = await itemsService.getFoundItems(req.query);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
// Get single found item by ID
async getFoundById(req, res) {
  try {
    const itemId = req.params.id;
    const item = await itemsService.getFoundItemById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Found item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



// Update found item
async updateFound(req, res) {
  try {
    const itemId = req.params.id;
    const updatedItem = await itemsService.updateFoundItem(itemId, req.body);
    if (!updatedItem) {
      return res.status(404).json({ message: "Found item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Upload image for found item
async uploadFoundImage(req, res) {
  try {
    const itemId = req.params.id;
    const file = req.file; // assuming multer middleware
    const updatedItem = await itemsService.uploadFoundItemImage(itemId, file);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

 // DELETE ITEM
  async deleteItem(req, res) {
    try {
      const itemId = req.params.id;
      const deletedItem = await itemsService.deleteItem(itemId);

      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


}
module.exports = new ItemsController();
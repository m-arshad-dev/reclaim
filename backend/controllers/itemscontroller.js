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

  async createFound(req, res) {
    try {
      const userId = req.user.id;
      const item = await itemsService.createFoundItem(userId, req.body);
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

  async getFound(req, res) {
    try {
      const items = await itemsService.getFoundItems(req.query);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new ItemsController();
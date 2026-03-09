const service = require('../services/lostFoundService');

class LostFoundController {
  async createItem(req, res) {
    try {
      const item = await service.createItem(req.body);
      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async getItems(req, res) {
    try {
      const items = await service.getItems(req.query, req.query.limit);
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async getItemById(req, res) {
    try {
      const item = await service.getItemById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async updateItem(req, res) {
    try {
      const item = await service.updateItem(req.params.id, req.body);
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async deleteItem(req, res) {
    try {
      const item = await service.deleteItem(req.params.id);
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new LostFoundController();
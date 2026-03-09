const repository = require('../repositories/lostFoundRepository');

class LostFoundService {
  createItem(data) {
    return repository.createItem(data);
  }

  getItems(filters, limit) {
    return repository.getItems(filters, limit);
  }

  getItemById(id) {
    return repository.getItemById(id);
  }

  updateItem(id, data) {
    return repository.updateItem(id, data);
  }

  deleteItem(id) {
    return repository.deleteItem(id);
  }
}

module.exports = new LostFoundService();
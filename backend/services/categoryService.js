const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    async getAllCategories(){
        return await categoryRepository.getAllCategories();
    }

}

module.exports = new CategoryService();
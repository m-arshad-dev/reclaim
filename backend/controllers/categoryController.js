const categoryService = require('../services/categoryService');

class CategoryController {
    async getAllCategories(req, res){
        try{
            const categories = await categoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories
            });
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController();
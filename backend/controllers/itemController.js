const itemService = require('../services/itemService');

class ItemController {
    async createItem(req,res){
        console.log("REQ USER:", req.user);
    console.log("USER ID:", req.user?.id);
        try{
         const {title,description,status,category_id,location_id}= req.body;
         const userId = req.user?.userId || req.user?.id;
         const image_url = req.file ? `/upload/${req.file.filename}`:null;
         const errors =[];
         if (!title || title.trim().length<3)
        errors.push("title must be at least 3 characters");
         if (!description || description.trim().length < 10)
        errors.push("description must be at least 10 characters");
      if (!status || !["lost", "found"].includes(status))
        errors.push("status must be either 'lost' or 'found'");
      if (category_id && isNaN(parseInt(category_id)))
        errors.push("category_id must be a number");
      if (location_id && isNaN(parseInt(location_id)))
        errors.push("location_id must be a number");
     if (errors.length){
        return res.status(400).json({ success: false, errors });
     }
     const item = await itemService.createItem({
        userId: userId,
        title,
        description,
        status,
        category_id,
        location_id,
        image_url,
     });
     return res.status(201).json({
        success:true,
        message:"item add successfully",
        data:item,
     });
        }catch(err){
 if (err.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "You already have an active post with this title",
        });
      }
      if (err.status) {
        return res.status(err.status).json({
          success: false,
          message: err.message,
        });
      }
      console.error("Create item error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
   async getAllCategorie(req, res){
    try{
        const categories = await itemService.getAllCategories();
         return res.status(200).json({ success: true, data: categories });
    }
      catch (err) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
   }
      async getAllLocation(req, res) {
    try {
      const locations = await itemService.getAllLocations();
      return res.status(200).json({ success: true, data: locations });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
    async getRecentItem(req, res) {
        try {
            const items = await itemService.getHomePageRecentItems();
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async searchItems(req, res) {
        try {
            const { query } = req.query;
            const items = await itemService.searchItemsByTitle(query);
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMyPosts(req, res) {
        try {
            const items = await itemService.getUserItems(req.params.userId);
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getItemDetails(req, res) {
        try {
            const item = await itemService.getItemDetails(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getItems(req, res) {
        try{
            const { status, categoryId, locationId, city, limit, offset } = req.query;
            const items = await itemService.getItems({status, categoryId, locationId, city, limit, offset});
            res.status(200).json({
                success: true,
                data: items,
                count: items.length
            });
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ItemController();
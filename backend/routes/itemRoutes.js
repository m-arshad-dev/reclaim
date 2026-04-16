const express = require('express');
const router = express.Router();
const multer =require ("multer");
const path = require("path");
const {v4:uuidv4}=require("uuid");
const itemController = require('../controllers/itemController');
const validateSearch = require('../middlewares/validateSearch');
const authenticate = require('../middlewares/authenticate');
//____multer setup------
const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"upload"),
    filename:(req,file,cb)=>
        cb(null,`${uuidv4()}${path.ectname(file.originalname)}`),

});
const upload = multer({
    storage,
    limits: {fileSize:5*1024*1024},
    fileFilter:(req,file,cb)=>{
        const allowed=/jpeg|jpg|png|webp/;
        const valid =
        allowed.test(path.extname(file.originalname).toLocaleLowerCase())&&
        allowed.test(file.mimetype);
        valid ? cb(null,true) : cb(new Error("Only Image are allowed"));
    },
});
router.post("/lost-found",authenticate,  upload.single("image"),itemController.createItem);
router.get("/categories"  ,  itemController.getAllCategorie);
router.get("/locations",     itemController.getAllLocation);
router.get('/recent',(req, res) =>    itemController.getRecentItems(req, res));

// Search items
router.get('/search', validateSearch, (req, res) => itemController.searchItems(req, res));

// Get user's posts
router.get('/my-posts/:userId', (req, res) => itemController.getMyPosts(req, res));

// Get item details
router.get('/:id', (req, res) => itemController.getItemDetails(req, res));

// Get items with filters
router.get('/', (req, res) => itemController.getItems(req, res));

module.exports = router;
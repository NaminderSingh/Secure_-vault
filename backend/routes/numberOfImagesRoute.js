const express = require('express')
const router = express.Router();
const {numberOfImagesController}=require('../controllers/numberOfImagesController')
const {authenticateToken}= require('../middleware/authenticateToken')
router.get('/numberOfImages',authenticateToken,numberOfImagesController)

module.exports=router
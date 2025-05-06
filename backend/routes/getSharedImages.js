
const express = require('express')
const router = express.Router();
const {getSharedImagesController}=require('../controllers/getSharedImagesController')
const {authenticateToken}= require('../middleware/authenticateToken')
router.get('/getSharedImages',authenticateToken,getSharedImagesController)

module.exports=router
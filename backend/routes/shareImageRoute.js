const express = require('express')
const router = express.Router();
const {shareImageController}=require('../controllers/shareImageController')

router.post('/shareImage',shareImageController)

module.exports=router
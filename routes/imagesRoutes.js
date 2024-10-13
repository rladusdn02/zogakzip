// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// 이미지 URL 생성
router.post('/image', imageController.uploadImage);

module.exports = router;

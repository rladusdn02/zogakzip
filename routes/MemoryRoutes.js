const express = require('express');
const memoryController = require('../controllers/memoryController');
const router = express.Router();

// 게시글 등록
router.post('/groups/:groupId/posts', memoryController.createMemory);

// 게시글 목록 조회
router.get('/groups/:groupId/posts', memoryController.getMemories);

// 게시글 수정
router.put('/posts/:postId', memoryController.updateMemory);

// 게시글 삭제
router.delete('/posts/:postId', memoryController.deleteMemory);

// 게시글 상세 정보 조회
router.get('/posts/:postId', memoryController.getMemoryDetails);

module.exports = router;

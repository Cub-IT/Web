const express = require('express');
const router = express.Router();
const controller = require('../controllers/PostController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/class/:class_id/new',                         authMiddleware(), controller.createPost );
router.get('/class/:class_id/get/:post_id', authMiddleware(), controller.getPost);
router.get('/class/:class_id/get',          authMiddleware(), controller.getPosts);

module.exports = router;
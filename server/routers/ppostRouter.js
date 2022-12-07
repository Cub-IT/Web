const express = require('express');
const router = express.Router();
const controller = require('../controllers/pPostController');

const authMiddleware = require('../middleware/authMiddleware');
const classAccessMiddleware = require('../middleware/classAccessMiddleware');

router.post('/class/:class_id/new',         
[
    authMiddleware(),
    classAccessMiddleware()
], controller.createPost );

router.get('/class/:class_id/get/:post_id', 
[
    authMiddleware(),
    classAccessMiddleware()
], controller.getPost);
router.get('/class/:class_id/get',
[
    authMiddleware(),
    classAccessMiddleware()
], controller.getPosts);

module.exports = router;
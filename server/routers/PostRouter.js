const express = require('express');
const router = express.Router();
const controller = require('../controllers/PostController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const classAccessMiddleware = require('../middleware/classAccessMiddleware');
const { check } = require('express-validator');

router.post('/class/:class_id/new',         
[
    check("title", 'Field "Title" cannot be empty must be less than 100 characters').isLength({ max: 100 }),
    check("description", 'Field "Description" cannot be empty and must be more than 6 and less than 500 characters').isLength({ min: 6, max: 500 }),
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

router.patch('/class/:class_id/modify/:post_id', 
[
    authMiddleware(),
    classAccessMiddleware(),
    roleMiddleware()
], controller.updatePost)

module.exports = router;
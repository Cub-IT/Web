const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClassController');

const authMiddleware = require('../middleware/authMiddleware');
const classAccessMiddleware = require('../middleware/classAccessMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { check } = require('express-validator');

router.post('/new',              
[
    check("title", 'Field "Title" must be more than 4 and less than 45 characters').notEmpty().isLength({ min: 4, max: 45 }),
    check("description", 'Field "Description" must be more than 6 and less than 256 characters').notEmpty().isLength({ min: 6, max: 256 }),
    authMiddleware()
],
controller.createClass );

router.patch('/add/user',
[
    check("code", 'Field "Title" cannot be empty').notEmpty(),
    authMiddleware()
],
controller.addUser);

router.get('/get/:class_id',     
[
    authMiddleware(),
    classAccessMiddleware()
],
controller.getClass );

router.delete('/delete/:class_id', 
[
    authMiddleware(),
    classAccessMiddleware(),
    roleMiddleware()
],
controller.deleteClass );

router.get('/get',               
[
    authMiddleware(),
    classAccessMiddleware()
],
controller.getClasses );

router.patch('/:class_id/modify', 
[
    check("title", 'Field "Title" must be more than 4 and less than 45 characters').notEmpty().isLength({ min: 4, max: 45 }),
    check("description", 'Field "Description" must be more than 6 and less than 256 characters').notEmpty().isLength({ min: 6, max: 256 }),
    authMiddleware(),
    classAccessMiddleware(),
    roleMiddleware()
]
,controller.updateClass)

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClassController');

const authMiddleware = require('../middleware/authMiddleware');
const classAccessMiddleware = require('../middleware/classAccessMiddleware');

router.post('/new',              authMiddleware(), controller.createClass );
router.post('/add/user',         authMiddleware(), controller.addUser);

router.get('/get/:class_id',     
[
    authMiddleware(),
    classAccessMiddleware()
],controller.getClass );


router.get('/get',               authMiddleware(), controller.getClasses );
// router.get('/:id/people/:role?', authMiddleware(), controller.getPeople );

module.exports = router;
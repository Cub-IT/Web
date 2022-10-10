const express = require('express');
const router = express.Router();
const controller = require('./classController');

const authMiddleware = require('./../middleware/authMiddleware');
const roleMiddleware = require('./../middleware/roleMiddleware');

router.get('/groups/:id',               authMiddleware(), controller.getClass );
router.get('/groups',                   authMiddleware(), controller.getClasses );
router.get('/groups/:id/people/:role?', authMiddleware(), controller.getPeople );

module.exports = router;
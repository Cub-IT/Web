const express = require('express');
const router = express.Router();
const controller = require('./classController');

const authMiddleware = require('./../middleware/authMiddleware');
const roleMiddleware = require('./../middleware/roleMiddleware');

router.get('/:id',               authMiddleware(), controller.getClass );
router.get('',                   authMiddleware(), controller.getClasses );
router.get('/:id/people/:role?', authMiddleware(), controller.getPeople );

module.exports = router;
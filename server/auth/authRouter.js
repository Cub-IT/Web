const Router = require('express');
const { check } = require('express-validator');
const router = new Router();
const controller = require('./authController');

const authMiddleware = require('./../middleware/authMiddleware');
const roleMiddleware = require('./../middleware/roleMiddleware');

router.post('/registration',
[
    check('first_name', 'Field "First name" cannot be empty').notEmpty(),
    check('last_name', 'Last "First name" cannot be empty').notEmpty(),
    check('email', 'Email is incorrect').isEmail(),
    check('password', 'password must be more than 6 and less than 12 characters').isLength({ min: 6, max: 12 })
], controller.registration )
router.post('/login', controller.login )
router.get('/users', roleMiddleware( ['ADMIN'] ), controller.getUsers )

module.exports = router;
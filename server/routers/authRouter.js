const express = require('express');

const { check } = require('express-validator');

const router = express.Router();
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

const controller = require('../controllers/authController');

const authMiddleware = require('./../middleware/authMiddleware');
const roleMiddleware = require('./../middleware/roleMiddleware');
const refreshMiddleware = require('../middleware/refreshMiddleware');

require('../auth/oauth2/github')
require('../auth/oauth2/google')

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

router.get('/good', function(req, res) {
    console.log(req.user);
    if(req.user)
        res.status(200).json({"status" : "ok"})
    else
        res.status(401).json({"status" : "not ok"})
})

router.post('/registration',
[
    check("first_name", 'Field "First name" cannot be empty').notEmpty(),
    check("last_name", 'Last "First name" cannot be empty').notEmpty(),
    check("email", 'Email is incorrect').isEmail(),
    check("password", 'password must be more than 6 and less than 12 characters').isLength({ min: 6, max: 20 })
], controller.registration )

router.get('/registration/:token', controller.confirmRegistration )

router.post('/login',
[
    check("email", 'Email is incorrect').isEmail(),
    check("password", 'password must be more than 6 and less than 12 characters').isLength({ min: 6, max: 20 })
], controller.login )


router.get('/login/github',
    passport.authenticate('github', { scope: [ 'profile', 'email' ] }), 
    function(req, res) {
        res.status(200).json( { "status": "github"});
    });

router.get('/login/github/callback',
    passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
        console.log(req);
        res.redirect('../../../../main.html')
    });

router.get('/login/google',
    passport.authenticate('google', { scope: [ 'profile', 'email' ] }), 
    function(req, res) {
        res.status(200).json( { "status": "google"});
    });

router.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    function(req, res) {
        console.log(req);
        res.redirect('../../../../main.html')
    });

router.get('/login/linkedin',
    passport.authenticate('linkedin', { scope: [ 'profile' ] }), 
    function(req, res) {
        res.status(200).json( { "status": "linkedin"});
    });

router.get('/login/linkedin/callback',
    passport.authenticate('linkedin', {failureRedirect: '/'}),
    function(req, res) {
        console.log(req);
        res.redirect('/main.html')
    });




// router.get("/logout", (req, res, next) => {
//     req.logout(err => {
//         if (err) next(err)
//         req.session.destroy();
//         res.redirect('/');
//     })
// });



router.get('/refresh/tokens', refreshMiddleware(), controller.refreshTokens )

module.exports = router;


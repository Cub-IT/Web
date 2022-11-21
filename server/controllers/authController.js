const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const tm = require('../tokenManager');

const User = require('../models/userModel');
const user = new User()

class authController {
    async registration(req, res) {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({message: 'Registration failed', validationErrors});
            }

            const { first_name, last_name, email, password } = req.body;

            user.registerUser(first_name, last_name, email, password).then((result) => {
                return res.status(200).json({ message: result })
            }).catch((error) => {
                return res.status(400).json( error.message )
            })
        } catch (error) {
            res.status(400).json({ message: 'Registration failed' })
        }
    }

    async confirmRegistration(req, res) {
        console.log("Confirm Registration")
        try {
            
            const confimationToken = req.params.token;

            user.createUser(confimationToken).then((result) => {
                res.redirect(result)
            }).catch((error) => {
                return res.status(400).json( error.message )
            })
        } catch (err) {
            res.status(400).json({ message: 'Registration failed' })
        }
    }

    async login(req, res) {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({message: 'Authorization failed', validationErrors});
            }

            const { email, password } = req.body;

            user.loginUser(email, password).then( ({ token, refreshToken }) => {
                return res.status(200).json( { 'status' : 'Logged in', token, refreshToken } )

            }).catch( (error) => {
                return res.status(400).json( error.message )
            })

        } catch (error) {
            res.status(400).json({message: 'Login failed'})
        }
    }

    async refreshTokens(req, res) {
        try {
            const refresh = req.headers.refresh.split(' ')[1];
            // const user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);

            const { token, refreshToken } = tm.refreshTokens(refresh)
            
            return res.status(200).json( { "status": "Refreshed", token, refreshToken });
        } catch (error) {
            console.log(error);
            return res.status(401).json( { message: "Refresh Token Expired" } )
        }
    }
}

module.exports = new authController();
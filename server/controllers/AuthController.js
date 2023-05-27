const { validationResult } = require('express-validator');

const MailSender = require('../mailsender');

const tm = require('../tokenManager');

const User = require('../models/UserModel');

class authController {

    async getUser (req, res) {
        try {
            const user = req.user
            User.getUser(user.email).then((user_info) => {
                const {id, first_name, last_name, email} = user_info;
                return res.status(200).json({id, first_name, last_name, email})    
            }).catch((error) => {
                return res.status(400).json(error.message)    
            })
        } catch (error) {
            return res.status(400).json(error.message)
        }
    }

    async registration(req, res) {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({message: 'Registration failed', validationErrors});
            }

            const { first_name, last_name, email, password } = req.body;

            User.registerUser(first_name, last_name, email, password).then((result) => {
                return res.status(200).json({ message: result })
            }).catch((error) => {
                return res.status(400).json( error.message )
            })
        } catch (error) {
            res.status(400).json({ message: 'Registration failed' })
        }
    }

    async confirmRegistration(req, res) {
        try {
            const confimationToken = req.params.token;

            const { first_name, last_name, email, password } = MailSender.parseConfirmationToken(confimationToken);

            User.createUser(first_name, last_name, email, password).then((result) => {
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

            User.loginUser(email, password).then( ({ token, refreshToken }) => {

                User.getUser(email).then((user) => {
                    const { first_name, last_name, email } = user;
                    return res.status(200).json( { 'status' : 'Logged in', token, refreshToken, first_name, last_name, email } )
                }).catch((error) => {
                    return res.status(400).json( error.message );
                })

            }).catch( (error) => {
                return res.status(400).json( error.message )
            })

        } catch (error) {
            res.status(400).json({message: 'Login failed'})
        }
    }

    async leaveClass(req, res) {
        try {
            const user = req.user
            const class_id = req.params.class_id

            User.leaveClass(user.id, class_id).then((result) => {
                return res.status(200).json(result)
            }).catch((error) => {
                return res.status(400).json(error.message)
            })
        } catch (error) {
            
        }
    }

    // async authorizeUser(req, res) {
    //     try {
    //         const user = req.user

            
    //     } catch (error) {
            
    //     }
    // }

    async refreshTokens(req, res) {
        try {
            const refresh = req.headers.refresh.split(' ')[1];

            const { token, refreshToken } = tm.refreshTokens(refresh)
            
            return res.status(200).json( { "status": "Refreshed", token, refreshToken });
        } catch (error) {
            console.log(error);
            return res.status(401).json( { message: "Refresh Token Expired" } )
        }
    }
}

module.exports = new authController();
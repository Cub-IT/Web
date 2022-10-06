const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const db = require('./../db');
const tm = require('./../tokenManager');

class authController {
    async registration(req, res) {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({message: 'Registration failed', validationErrors});
            }

            const { first_name, last_name, email, password } = req.body;
            const sql = `SELECT count(*) AS count FROM user WHERE email='${email}'`;
            db.query(sql, (err, result) => {
                const users = result[0];

                if(users.count) {
                    return res.status(400).json({ message: 'User with this email already exists' });
                }
                const salt = (Math.random() + 1).toString(36).substring(7);
                const hashPassword = bcryptjs.hashSync(password + salt, Number(process.env.HASH_LENGTH));
                const newUserSql = 'INSERT INTO `user` (first_name, last_name, email, password, salt) VALUES (?)';
                const user_values = [ first_name, last_name, email, hashPassword, salt ];

                db.query(newUserSql, [user_values], (err, result) => {
                    if(err)
                        throw err;

                    const user_id = result.insertId;

                    const token = tm.generateAccessToken(user_id, email, 'USER', process.env.ACCESS_TOKEN_SECRET)
                    const refreshToken = tm.generateRefreshToken(user_id, email, 'USER', process.env.REFRESH_TOKEN_SECRET);

                    return res.status(200).json({ "status": "Registered", token, refreshToken });
                })
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'Registration failed'})
        }
    }

    async login(req, res) {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({message: 'Registration failed', validationErrors});
            }

            const { email, password } = req.body;
            const sql = `SELECT * FROM user WHERE email='${email}'`;
            db.query(sql, (err, result) => {
                const user = result[0];

                if(!user) {
                    //if exists in DATABASE
                    return res.status(400).json({ message: 'User with this email does not exists' });
                }
                //authorization
                const validPassword = bcryptjs.compareSync(password + user.salt, user.password);
                if(!validPassword) {
                    //if invalid password
                    return res.status(400).json({ message: 'Incorrect password' });
                }

                const token        = tm.generateAccessToken(user.user_id, user.email, user.role, process.env.ACCESS_TOKEN_SECRET);
                const refreshToken = tm.generateRefreshToken(user.user_id, user.email, user.role, process.env.REFRESH_TOKEN_SECRET);


                return res.status(200).json({  "status": "Logged in", token, refreshToken });
            })

        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'Login failed'})
        }
    }

    async refreshTokens(req, res) {
        try {
            const refresh = req.headers.refresh.split(' ')[1];
            const user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);

            const { token, refreshToken } = tm.refreshTokens(refresh)
            
            return res.status(200).json( { "status": "Refreshed", token, refreshToken });
        } catch (error) {
            console.log(error);
            return res.status(401).json( { message: "Refresh Token Expired" } )
        }
    }

    async getUsers(req, res) {
        try {
            const sql = 'SELECT * FROM `user`'
            db.query(sql, (err, result) => {
                res.send(result);
            })
        } catch (error) {

        }
    }
}

module.exports = new authController();
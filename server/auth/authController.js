const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const db = require('./../db');
const { secret } = require('./../config');

const HASH_LENGTH = 7;

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }

    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async registration(req, res) {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({message: 'Registration failed', validationErrors});
            }

            const { first_name, last_name, email, password } = req.body;
            const sql = `SELECT count(*) AS count FROM users WHERE email='${email}'`;
            db.query(sql, (err, result) => {
                const users = result[0];

                if(users.count) {
                    //if exists in DATABASE
                    return res.status(400).json({ message: 'User with this email already exists' });
                }
                //insert new user to DATABASE
                const hashPassword = bcryptjs.hashSync(password, HASH_LENGTH);
                const newUserSql = 'INSERT INTO `users` (first_name, last_name, email, password) VALUES (?)';
                const user_values = [ first_name, last_name, email, hashPassword ];

                db.query(newUserSql, [user_values], (err, result) => {
                    if(err)
                        throw err;
                    res.status(200).json({ message: 'User has been created'});
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
            const sql = `SELECT * FROM users WHERE email='${email}'`;
            db.query(sql, (err, result) => {
                const user = result[0];

                if(!user) {
                    //if exists in DATABASE
                    return res.status(400).json({ message: 'User with this email does not exists' });
                }
                //authorization
                const validPassword = bcryptjs.compareSync(password, user.password);
                if(!validPassword) {
                    //if invalid password
                    return res.status(400).json({ message: 'Incorrect password' });
                }

                console.log('login' + user);
                const token = generateAccessToken(user.user_id, user.role);
                return res.status(200).json({ token });
            })

        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'Login failed'})
        }
    }
    async getUsers(req, res) {
        try {
            const sql = 'SELECT * FROM `users`'
            db.query(sql, (err, result) => {
                res.send(result);
            })
        } catch (error) {

        }
    }
}

module.exports = new authController();
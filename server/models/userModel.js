const bcryptjs = require('bcryptjs');
const db = require('../db');
const tm = require('../tokenManager');

const MailSender = require('../mailsender');
const mailsender = require('../mailsender');

class User {
    constructor() {

    }

    findById(ids) {

    }

    findByEmail(email) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT * FROM user WHERE email='${email}'`;

            db.query(sql, (err, result) => {
                return resolve(result[0])
            })
        })
    }

    loginUser(email, password) {
        return new Promise(( resolve, reject ) => {
            this.findByEmail(email).then((user) => {
                if (!user) return reject( new Error('User does not exists') )

                const validPassword = bcryptjs.compareSync(password + user.salt, user.password);
                if (!validPassword) return reject( new Error('Incorrect password') )
                
                const token        = tm.generateAccessToken(user.id, user.email, user.role, process.env.ACCESS_TOKEN_SECRET);
                const refreshToken = tm.generateRefreshToken(user.id, user.email, user.role, process.env.REFRESH_TOKEN_SECRET);

                return resolve( { token, refreshToken } )
            })
        })
    }
    
    registerUser(first_name, last_name, email, password) {
        return new Promise(( resolve, reject ) => {
            this.findByEmail(email).then((user) => {
                if (user) return reject( new Error('User with this email already exists') )

                const confirmToken = MailSender.generateConfirmationToken(first_name, last_name, email, password);

                MailSender.sendConfirmationEmail(email, confirmToken).then((result) => {
                    resolve(result)
                }).catch((error) => {
                    reject(error)
                });
            })
        })
    }

    createUser(confirmationToken) {
        return new Promise(( resolve, reject ) => {
            const { first_name, last_name, email, password } = MailSender.parseConfirmationToken(confirmationToken);
            this.findByEmail(email).then((user) => {
                if (user) return reject( new Error('User with this email already exists') )

                const salt = (Math.random() + 1).toString(36).substring(7);
                const hashPassword = bcryptjs.hashSync(password + salt, Number(process.env.HASH_LENGTH));

                const user_values = [ first_name, last_name, email, hashPassword, salt ];

                const newUserSql = 'INSERT IGNORE INTO `user` (first_name, last_name, email, password, salt) VALUES (?)';

                db.query(newUserSql, [user_values], (err, result) => {
                    if(err)
                        throw err;

                    return resolve('https://2b4.app/cub-it/');
                })
            })
        })
    }
}

module.exports = User
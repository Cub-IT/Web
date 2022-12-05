const bcryptjs = require('bcryptjs');
const tm = require('../tokenManager');

const MailSender = require('../mailsender');

const UserDAO = require('../dao/UserDAO')

class User {
    constructor() {

    }

    loginUser(email, password) {
        return new Promise(( resolve, reject ) => {
            UserDAO.findByEmail(email).then((user) => {
                if (!user) return reject( new Error('User does not exists') )

                const validPassword = bcryptjs.compareSync(password + user.salt, user.password);
                if (!validPassword) return reject( new Error('Incorrect password') )
                
                const token        = tm.generateAccessToken(user.id, user.email);
                const refreshToken = tm.generateRefreshToken(user.id, user.email);

                return resolve( { token, refreshToken } )
            })
        })
    }
    
    registerUser(first_name, last_name, email, password) {
        return new Promise(( resolve, reject ) => {
            UserDAO.findByEmail(email).then((user) => {
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
            UserDAO.findByEmail(email).then((user) => {
                if (user) return reject( new Error('User with this email already exists') )

                const salt = (Math.random() + 1).toString(36).substring(7);
                const hashPassword = bcryptjs.hashSync(password + salt, Number(process.env.HASH_LENGTH));

                const user_values = [ first_name, last_name, email, hashPassword, salt ];

                UserDAO.insert(user_values, true).then(() => {
                    return resolve('https://2b4.app/cub-it/');
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
}

module.exports = new User();
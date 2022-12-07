const db = require('../database/db');

class UserDAO {
    constructor() {

    }

    findByIds (...ids) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT * FROM user WHERE id IN( ${ids.join(', ')} )`;

            db.query(sql, (err, result) => {
                if(err)
                    return reject(err)

                return resolve(result[0])
            })
        })
    }

    findByEmail(email) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT * FROM user WHERE email='${email}'`;

            db.query(sql, (err, result) => {
                if(err)
                    throw err;

                return resolve(result[0])
            })
        })
    }

    insert (values, ignore = false) {
        return new Promise(( resolve, reject ) => {
            const sql = `INSERT ${ ignore ? 'IGNORE' : '' } INTO user (first_name, last_name, email, password, salt) VALUES (?)`;

            db.query(sql, [values], (err, result) => {
                if(err)
                    throw err
                
                return resolve(result.insertId)
            })
        })
    }

    update () {
        return new Promise(( resolve, reject ) => {
            const sql = ''

            db.query(sql, [values], (err, result) => {
                if(err)
                    throw err;
            })
        })
    }
}

module.exports = new UserDAO();
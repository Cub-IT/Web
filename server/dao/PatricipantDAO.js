const db = require("../database/db")

const DBHelper = require("../database/dbhelper");

class ParticipantDAO {
    constructor() {

    }

    insert (user_id, class_id, role = 'admin') {
        return new Promise(( resolve, reject ) => {
            const sql = 'INSERT IGNORE INTO participant (user_id, class_id, label) VALUES (?)'

            db.query(sql, [[user_id, class_id, role]], (err, result) => {
                if (err)
                    throw err
                
                return resolve(result)
            })
        })
    }

    delete(user_id, class_id) {
        return new Promise(( resolve, reject ) => {
            const sql = `DELETE FROM participant WHERE user_id = ${user_id} AND class_id = ${class_id}`

            db.query(sql, (err, result) => {
                if (err)
                    return reject(err)
                
                return resolve('User deleted succesfuly')
            })
        })
    }


    getClassesIds (user_id, class_id, label) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT class_id FROM participant WHERE user_id = ${user_id} ${class_id ? `AND class_id = ${class_id}` : ''} ${ label ? `AND label = '${label}'` : '' }`

            console.log(sql)
            
            db.query(sql, (err, result) => {
                if (err)
                    throw err

                return resolve(DBHelper.toArrayOfValues(result))
            })
        })
    }
}

module.exports = new ParticipantDAO()
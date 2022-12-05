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


    getClassesIds (user_id, class_id) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT class_id FROM participant WHERE user_id = ${user_id} ${class_id ? `AND class_id = ${class_id}` : ''}`

            db.query(sql, (err, result) => {
                if (err)
                    throw err

                return resolve(DBHelper.toArrayOfValues(result))
            })
        })
    }
}

module.exports = new ParticipantDAO()
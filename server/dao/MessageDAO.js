const db = require("../database/db")

const DBHelper = require("../database/dbhelper");

class MessageDAO {

    constructor() {

    }
    insert(user_id, class_id, message, send_date) {
        return new Promise(( resolve, reject ) => {
            const sql = 'INSERT INTO message (user_id, class_id, message, send_date) VALUES (?)'

            db.query(sql, [[user_id, class_id, message, send_date]], (err, result) => {
                if (err)
                    throw err
                return resolve();
            })
        })
    }

    get(class_id) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT
            message.user_id,
            message.message, 
            message.send_date,
            user.first_name,
            user.last_name
            FROM message INNER JOIN user ON user.id = message.user_id
            WHERE message.class_id = ${class_id}`;

            db.query(sql, (err, result) => {
                if (err)
                    throw err

                return resolve(result)
            })
        })
    }
}

module.exports = new MessageDAO()
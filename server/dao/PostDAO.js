const db = require("../database/db")

const DBHelper = require("../database/dbhelper");

class ParticipantDAO {

    constructor() {

    }
    insert (title, description, user_id, class_id) {
        return new Promise(( resolve, reject ) => {
            const sql = 'INSERT INTO post (title, description, participant_user_id, participant_class_id) VALUES (?)'

            db.query(sql, [[title, description, user_id, class_id]], (err, result) => {
                if (err)
                    throw err
                
                this.get(class_id, result.insertId).then((post) => {
                    return resolve(post)
                })
            })
        })
    }


    get(class_id, post_id) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT
            post.id, post.title,
            post.description, post.creation_date,
            user.first_name AS creator_first_name,
            user.last_name AS creator_last_name 
            FROM post INNER JOIN user ON user.id = participant_user_id
            WHERE participant_class_id = ${class_id} ${post_id ? `AND post.id = ${post_id}` : ''}
            ORDER BY post.creation_date DESC`;

            db.query(sql, (err, result) => {
                if (err)
                    throw err

                return resolve(result)
            })
        })
    }
}

module.exports = new ParticipantDAO()
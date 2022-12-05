const db = require("../database/db")

const ParticipantDAO = require('../dao/PatricipantDAO')

class ClassDAO {
    constructor () {

    }

    findByIds(...ids) {
        return new Promise(( resolve, reject ) => {
            const sql = `SELECT * FROM class WHERE id IN ( ${ids.join(', ')} )`

            db.query(sql, (err, result) => {
                if (err)
                    throw err
                
                return resolve(result)
            })
        })
    }

    findByCode(code) {
        return new Promise(( resolve, reject ) => {
            const sql = 'SELECT * FROM class WHERE code = ?';

            db.query(sql, code, (err, result) => {
                if (err)
                    throw err
                
                return resolve(result);
            })
        })
    }

    get (user_id, class_id) {
        return new Promise(( resolve, reject ) => {

            ParticipantDAO.getClassesIds(user_id, class_id).then((class_ids) => {
                console.log(class_ids);
                const sql = `SELECT * FROM class WHERE id IN (?)`

                db.query(sql, [class_ids], (err, result) => {
                    if (err)
                        throw err
                    
                    return resolve(result)
                })
            })
        })
    }

    insert (title, description, user_id) {
        return new Promise(( resolve, reject ) => {
            const sql = `INSERT INTO class (title, description, code) VALUES('${title}', '${description}', RandString())`

            db.query(sql, (err, result) => {
                if (err)
                    throw err
                
                ParticipantDAO.insert(user_id, result.insertId).then(() => {
                    this.get(user_id, result.insertId).then((group) => {
                        return resolve(group)
                    })
                }).catch((error) => {
                    return reject(error)
                })
            })
        })
    }
}

module.exports = new ClassDAO()
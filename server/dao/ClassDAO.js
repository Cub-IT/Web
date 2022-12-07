const db = require("../database/db")

const ParticipantDAO = require('./PatricipantDAO')

class ClassDAO {
    baseSql = ""
    constructor () {
        this.baseSql = `SELECT 
                            class.*, 
                            p.label,
                            u.first_name as creator_first_name,
                            u.last_name as creator_last_name
                        FROM class 
                        INNER JOIN 
                            (SELECT label, class_id, user_id FROM participant) p
                            ON class.id = p.class_id
                        INNER JOIN 
                            (SELECT class_id, user_id FROM participant WHERE label = 'admin') p2 
                            ON p2.class_id = p.class_id 
                        INNER JOIN user u 
                            ON u.id = p2.user_id`;
    }


    findByIds(user_id, ...ids) {
        return new Promise(( resolve, reject ) => {
            const sql = `${this.baseSql} WHERE p.user_id = ${user_id} AND class.id IN ( ${ids.join(', ')} )`

            db.query(sql, (err, result) => {
                if (err)
                    throw err
                
                return resolve(result)
            })
        })
    }

    findByCode(code) {
        return new Promise(( resolve, reject ) => {
            const sql = `${this.baseSql} WHERE class.code = ?`;

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
                const sql = `${this.baseSql} WHERE p.user_id = ${user_id} AND class.id IN (?)`

                db.query(sql,  [class_ids], (err, result) => {
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
const ClassDAO = require('../dao/ClassDAO')
const ParticipantDAO = require('../dao/PatricipantDAO')

// used group instead class, bcs class reserver name 

class Class {
    constructor() {

    }

    getClass(user_id, class_id) {
        return new Promise(( resolve, reject ) => {
            ClassDAO.get(user_id, class_id).then((group) => {
                return resolve(group)
            })
        })
    }

    getClasses(user_id) {
        return new Promise(( resolve, reject ) => {
            ClassDAO.get(user_id).then((groups) => {
                return resolve(groups)
            })
        })
    }

    createClass(title, description, user_id) {
        return new Promise(( resolve, reject ) => {
            ClassDAO.insert(title, description, user_id).then((group) => {
                return resolve(group)
            }).catch((error) => {
                return reject('Insert Error')
            })
        })
    }

    addUser(user_id, code) {
        return new Promise(( resolve, reject ) => {
            ClassDAO.findByCode(code).then((group) => {
                if (!group[0])
                    return reject("Class with this code does not exest");
                
                ParticipantDAO.insert(user_id, group[0].id, 'user').then(() => {
                    return resolve(group[0])
                }).catch((error) => {
                    return reject(error)
                })
            })
        })
    }
}


module.exports = new Class();
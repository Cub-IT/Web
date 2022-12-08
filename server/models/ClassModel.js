const { deleteClass } = require('../controllers/ClassController')
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
                    return reject(new Error("Class with this code does not exist"));

                ParticipantDAO.getClassesIds(user_id, group[0].id).then((ids) => {
                    if (ids.length != 0 ) {
                        return reject(new Error("User already exist in class"))
                    }

                    ParticipantDAO.insert(user_id, group[0].id, 'user').then(() => {
                        console.log(group[0])
                        return resolve(group[0])
                    }).catch((error) => {
                        return reject(error)
                    })
                })
            })
        })
    }

    deleteClass(user_id, class_id) {
        return new Promise(( resolve, reject ) => {
            ClassDAO.findByIds(user_id, class_id).then((group) => {
                if(!group)
                    return reject(new Error('Class does not exests'))
                
                ClassDAO.delete(class_id).then((result) => {
                    return resolve(result)
                }).catch((error) => {
                    return reject(error.message)
                })
            })
        })
    }

    updateClass(user_id, class_id, title, description) {
        return new Promise(( resolve, reject ) => {
            ClassDAO.update(class_id, title, description).then(() => {
                ClassDAO.get(user_id, class_id).then((group) => {
                    return resolve(group)
                })
            }).catch((error) => {
                return reject(error.message)
            })
        })
    }
}


module.exports = new Class();
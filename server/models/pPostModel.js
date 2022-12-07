const PostDAO = require('../dao/pPostDAO')

class Class {
    constructor() {

    }

    createPost(title, description, user_id, class_id) {
        return new Promise(( resolve, reject ) => {
            PostDAO.insert(title, description, user_id, class_id).then((post) => {
                return resolve(post)
            }).catch((error) => {
                return reject('Insert Error')
            })
        })
    }

    getPost(class_id, post_id) {
        return new Promise(( resolve, reject ) => {
            PostDAO.get(class_id, post_id).then((post) => {
                return resolve(post)
            })
        })
    }

    getPosts(class_id) {
        return new Promise(( resolve, reject ) => {
            PostDAO.get(class_id).then((posts) => {
                return resolve(posts)
            })
        })
    }
}


module.exports = new Class();
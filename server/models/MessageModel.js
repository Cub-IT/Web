const MessageDAO = require('../dao/MessageDAO')

class Message {
    constructor() {

    }

    createMessage(user_id, class_id, message, send_date) {
        return new Promise(( resolve, reject) => {
            MessageDAO.insert(user_id, class_id, message, send_date).then(() => {
                return resolve();
            }).catch((error) => {
                return reject('Insert Error');
            })
        })
    }

    getMessages(class_id) {
        return new Promise(( resolve, reject ) => {
            MessageDAO.get(class_id).then((messages) => {
                return resolve(messages);
            }).catch((error) => {
                return reject('Get Error');
            })
        })
    }
}


module.exports = new Message();
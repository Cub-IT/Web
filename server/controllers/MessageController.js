const Message = require('../models/MessageModel');

class classController {
    async getMessages(req, res) {
        try {
            const class_id = req.params.class_id
            Message.getMessages(class_id).then((messages) => {
                return res.status(200).json(messages);
            }).catch((error) => {
                return res.status(400).json(error.message);
            });
        } 
        catch (error) {
            res.status(401).json({message: 'Get Post Error'});
        }
    }
}

module.exports = new classController();
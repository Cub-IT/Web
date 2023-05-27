const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClassController');
const messageController = require('../controllers/MessageController');

const authMiddleware = require('../middleware/authMiddleware');
const classAccessMiddleware = require('../middleware/classAccessMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { check } = require('express-validator');

const io = require('../socket').get();

router.post('/new',              
[
    check("title", 'Field "Title" must be more than 4 and less than 45 characters').notEmpty().isLength({ min: 4, max: 45 }),
    check("description", 'Field "Description" must be more than 6 and less than 256 characters').notEmpty().isLength({ min: 6, max: 256 }),
    authMiddleware()
],
controller.createClass );

router.patch('/add/user',
[
    check("code", 'Field "Title" cannot be empty').notEmpty(),
    authMiddleware()
],
controller.addUser);

router.get('/get/:class_id',     
[
    authMiddleware(),
    classAccessMiddleware()
],
controller.getClass );

router.delete('/delete/:class_id', 
[
    authMiddleware(),
    classAccessMiddleware(),
    roleMiddleware()
],
controller.deleteClass );

router.get('/get',               
[
    authMiddleware(),
    classAccessMiddleware()
],
controller.getClasses );

router.patch('/:class_id/modify', 
[
    check("title", 'Field "Title" must be more than 4 and less than 45 characters').notEmpty().isLength({ min: 4, max: 45 }),
    check("description", 'Field "Description" must be more than 6 and less than 256 characters').notEmpty().isLength({ min: 6, max: 256 }),
    authMiddleware(),
    classAccessMiddleware(),
    roleMiddleware()
]
,controller.updateClass)

router.get('/:class_id/messages', [
    authMiddleware(),
    classAccessMiddleware()
], messageController.getMessages)


const MessageModel = require('../models/MessageModel');

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)
        
        socket.on('disconnect', () => {
          socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })

    socket.on('leave-room', (roomId, userId) => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
    socket.on('join-chat', (chatId, user) => {
        socket.join(chatId);
        socket.on('user-send-message', (message) => {
            const send_date = new Date();
            MessageModel.createMessage(user.id, chatId, message, send_date).then(() => {
                io.to(chatId).emit('message', {user, message, send_date})
            })

        })
        socket.on('user-typing', () => {
            console.log('user-typing');
            socket.broadcast.to(chatId).emit('typing', user);

            socket.on('user-stop-typing', () => {
                console.log('user stop typing');
                socket.broadcast.to(chatId).emit('stop-typing', user);
            })
        })

        socket.on('disconnect', () => {
            socket.broadcast.to(chatId).emit('stop-typing', user);
        })
    }) 
})



module.exports = router;
const express = require('express');

const db = require('./db');

const authRouter  = require('./auth/authRouter');
const classRouter = require('./class/classRouter');

module.exports = function(app) {
    app.use('/api/auth', authRouter);

    app.use('/api/class', classRouter);
    
    
    //test api
    app.post('/api/users', (req, res) => {
        console.log(req.body);
        const sql = 'SELECT * FROM `user`'
        db.query(sql, function(err, result) {
            res.send(result)
        })
    })
    
    app.get('/*', express.static(`${__dirname}/../site`));    
}



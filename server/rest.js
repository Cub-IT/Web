const express = require('express');

const db = require('./db');

const authRouter  = require('./routers/authRouter');
const classRouter = require('./routers/classRouter');

module.exports = function(app) {
    app.use('/api/auth', authRouter);

    app.use('/api/class', classRouter);
    

    app.get('/*', express.static(`./build`));    
}



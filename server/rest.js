const express = require('express');

const authRouter  = require('./routers/AuthRouter');
const classRouter = require('./routers/ClassRouter');
const postRouter = require('./routers/PostRouter');

module.exports = function(app) {
    app.use('/api/auth', authRouter);

    app.use('/api/class', classRouter);

    app.use('/api/post', postRouter);
    

    app.get('/*', express.static(`./build`));    
}



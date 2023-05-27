const hostname =require('os').hostname()
const path = require('path');
const fs = require('fs');

const creds = {
	key: fs.readFileSync('selfsigned.key', 'utf8'),
	cert: fs.readFileSync('selfsigned.crt', 'utf8')
};

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = require('./database/db');

//initialize a simple http server
const session = require('express-session')
const express = require('express');
const app = express();
const server = require('https').createServer(creds, app);
const io = require('./socket').init(server);

app.use(express.json())

app.use('/scripts', express.static(__dirname + '/../node_modules/'));

app.use(session({
    secret: 'cub-it',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}))

require('./rest')(app);

const PORT = process.env.PORT;

const start = async() => {
    try {
        db.connect( (error) => { 
            if(error) {
                throw error;
            }
            console.log("Database connected"); 
        });
        server.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
    }
    catch (error) {
        console.log(error);
    }
}

start();

// require('./debug')
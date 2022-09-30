// const { parseJSON } = require('jquery');
// const server = http.createServer(app);

// const http = require('http');
// const WebSocket = require('ws');

// const bodyParser = require('body-parser');

// const url = require('url');
// const proxy = require('express-http-proxy');


//initialize a simple http server
const express = require('express');
const path = require('path');

//custom scripts
const authRouter = require('./auth/authRouter');
const db = require('./db');
const tm = require('./tokenManager');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json())
app.use('/auth', authRouter);

app.get('/*', express.static('./build'));

app.get('/rest/users', (req, res) => {
    const sql = 'SELECT * FROM `users`'
    db.query(sql, function(err, result) {
        res.send(result)
    })
})

const start = async() => {
    try {
        db.connect( (error)=> { 
            if(error) {
                throw error;
            }
            console.log("Database connected"); 
        });
        app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
    }
    catch (error) {
        console.log(error);
    }
}

start();
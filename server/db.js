const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cubit1235',
    database: 'cub_it'
})

module.exports =  db;
const mysql = require('mysql');

const fs = require('fs');

const MachineName = require('os').hostname().split('.')[0];

const configData = fs.readFileSync(`${__dirname}/../config/config-${MachineName}.json`);
const connectionData = JSON.parse(configData).DataBaseConnect

const db = mysql.createConnection(connectionData)

module.exports =  db;
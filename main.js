const { get } = require('browser-sync');
const { parseJSON } = require('jquery');

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const bodyParser = require('body-parser');

const url = require('url');
const proxy = require('express-http-proxy');

//initialize a simple http server
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/*', express.static('./build'));

server.listen(3000);
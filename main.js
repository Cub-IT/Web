const { get } = require('browser-sync');
const { parseJSON } = require('jquery');

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

app.use(express.json());

app.get('/*', express.static('./build'));

server.listen(9090);
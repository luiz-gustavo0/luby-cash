const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const Consumer = require('./kafka/consumer');

require('./database');

const app = express();

const consumer = new Consumer('newUsersGroup');
consumer.consume('create-user');

app.use(cors());
app.use(routes);

module.exports = app;

const express = require('express');
const cors = require('cors');
const Consumer = require('./kafka/consumer');

require('./database');

const app = express();

const consumer = new Consumer('newUsersGroup');
consumer.consume('create-user');

app.use(cors());

module.exports = app;

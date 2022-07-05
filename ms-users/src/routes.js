const { Router } = require('express');
const routes = Router();

const ClientController = require('./controllers/ClientController');

const clientController = new ClientController();

routes.get('/', clientController.index);

module.exports = routes;

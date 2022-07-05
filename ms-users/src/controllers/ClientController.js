const Client = require('../database/models/Client');

class ClientController {
  async index(req, res) {
    const clients = await Client.findAll();

    return res.json(clients);
  }
}

module.exports = ClientController;

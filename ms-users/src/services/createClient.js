const Mail = require('./mail');
const Client = require('../database/models/Client.js');

class CreateClient {
  async create(data) {
    if (data.average_salary > 500) {
      data.current_balance = 200;
      data.status = true;
    } else {
      data.current_balance = 0;
      data.status = false;
    }

    try {
      await Client.create(data);

      const mailService = new Mail();

      await mailService.sendMail({
        name: data.full_name,
        email: data.email,
        status: data.status,
      });
    } catch (error) {
      console.log('CreateClient', error);
    }
  }
}

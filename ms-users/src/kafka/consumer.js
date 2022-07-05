const { Kafka, logLevel } = require('kafkajs');

const CreateClient = require('../services/createClient.js');

class Consumer {
  consumer;

  constructor(groupId) {
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'],
      logLevel: logLevel.WARN,
      retry: {
        initialRetryTime: 300,
        retries: 10,
      },
    });

    this.consumer = kafka.consumer({ groupId });
  }

  async consume(topic) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value);

        const createClientService = new CreateClient();

        await createClientService.create(payload);
      },
    });
  }
}

module.exports = Consumer;

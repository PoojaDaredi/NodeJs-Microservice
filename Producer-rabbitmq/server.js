import amqp from "amqplib";

// setup queue name
const queueName = 'test-queue';

/**
 * Send message
 */
async function send() {
  // connect to RabbitMQ
  const connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://localhost');
  // create a channel
  const channel = await connection.createChannel();
  // create/update a queue to make sure the queue is exist
  await channel.assertQueue(queueName, {
    durable: true,
  });
  // generate correlation id, basically correlation id used to know if the message is still related with another message
  // send 10 messages and generate message id for each messages
  for (let i = 1; i <= 10; i++) {
    const buff = Buffer.from(JSON.stringify({
      test: `Hello from RabbitMQ ${i}`
    }), 'utf-8');
    const result = channel.sendToQueue(queueName, buff);
    console.log(result);
  }
  // close the channel
  await channel.close();
  // close the connection
  await connection.close();
}

send();
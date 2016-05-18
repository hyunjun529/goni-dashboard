/* eslint no-console: 0 */
import amqp from 'amqplib/callback_api';
import {
  queueHost,
  queuePort,
  queueUser,
  queuePass,
  queueName,
} from './auth';

amqp.connect(`amqp://${queueUser}:${queuePass}@${queueHost}:${queuePort}`, (connErr, conn) => {
  if (connErr != null) {
    console.error(connErr);
    process.exit(1);
  }
  conn.createChannel((err, ch) => {
    if (err != null) {
      console.error(err);
      process.exit(1);
    }
    ch.assertQueue(queueName, {
      durable: true,
    });
    ch.consume(queueName, async(msg) => {
      try {
        console.log(msg.content.toString());
      } catch (error) {
        console.log(error);
      }
    });
  });
});

import { NestFactory } from '@nestjs/core';
import { UsersMicroModule } from './users-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersMicroModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'users_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'sms_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();

  console.log('Users microservice is listening');
}

bootstrap();

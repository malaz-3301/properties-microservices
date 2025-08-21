import { NestFactory } from '@nestjs/core';
import { UsersMicroModule } from './users-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersMicroModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'users_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.listen();
  console.log('Users microservice is listening')
}
bootstrap();

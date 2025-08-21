import { NestFactory } from '@nestjs/core';
import { AuthMicroModule } from './auth-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthMicroModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Auth microservice is listening')
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { CommerceMicroModule } from './commerce-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CommerceMicroModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'commerce_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Commerce microservice is listening')
}
bootstrap();

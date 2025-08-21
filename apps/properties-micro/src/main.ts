import { NestFactory } from '@nestjs/core';
import { PropertiesMicroModule } from './properties-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PropertiesMicroModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'properties_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Properties microservice is listening')
}
bootstrap();

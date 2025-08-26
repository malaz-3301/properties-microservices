import { NestFactory } from '@nestjs/core';
import { PropertiesMicroModule } from './properties-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config({ path: '.env.development' });

async function bootstrap() {
  const app = await NestFactory.create(PropertiesMicroModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ, //AMQP
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://rabbitmq:5672'],
      queue: 'properties_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://rabbitmq:5672'],
      queue: 'geo_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });
  await app.startAllMicroservices();

  console.log('Properties microservice is listening');
}

bootstrap();

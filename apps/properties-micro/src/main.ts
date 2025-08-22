import { NestFactory } from '@nestjs/core';
import { PropertiesMicroModule } from './properties-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PropertiesMicroModule, {
    logger: false,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ, //AMQP
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'properties_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'geo_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });
  await app.startAllMicroservices();

  console.log('Properties microservice is listening');
}

bootstrap();

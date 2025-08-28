import { NestFactory } from '@nestjs/core';
import { CommerceMicroModule } from './commerce-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config({ path: '.env.development' });

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommerceMicroModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: 'commerce_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  console.log('Commerce microservice is listening');
}

bootstrap();

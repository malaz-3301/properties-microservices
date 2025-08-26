import { NestFactory } from '@nestjs/core';
import { ReportsMicroModule } from './reports-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config({ path: '.env.development' });

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReportsMicroModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://rabbitmq:5672'],
        queue: 'reports_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  console.log('Reports microservice is listening');
}

bootstrap();

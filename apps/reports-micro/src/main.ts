import { NestFactory } from '@nestjs/core';
import { ReportsMicroModule } from './reports-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ReportsMicroModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'reports_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Reports microservice is listening')
}
bootstrap();

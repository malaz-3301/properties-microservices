import { NestFactory } from '@nestjs/core';
import { AutomationAnalyticsMicroModule } from './automation-analytics-micro.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AutomationAnalyticsMicroModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'analytics_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Analytics microservice is listening')
}
bootstrap();

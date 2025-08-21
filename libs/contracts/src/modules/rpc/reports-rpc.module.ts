import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORTS_SERVICES',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'reports_queue',
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ReportsRpcModule{}

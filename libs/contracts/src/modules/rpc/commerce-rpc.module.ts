import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMERCE_SERVICES',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'commerce_queue',
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class CommerceRpcModule{}

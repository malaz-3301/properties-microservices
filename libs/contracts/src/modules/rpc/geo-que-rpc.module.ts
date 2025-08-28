import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config({ path: '.env.development' });

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GEO_SERVICE',
        transport: Transport.RMQ, //AMQP (Advanced Message Queuing Protocol)
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: 'geo_queue',
          queueOptions: { durable: true },
          // خطأ تضعها هنا noAck: false,
          //   prefetchCount: 1, // هذا يمنع استقبال أكثر من رسالة في نفس الوقت
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GeoQueRpcModule {}

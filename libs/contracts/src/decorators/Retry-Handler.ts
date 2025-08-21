import { Ctx, Payload, RmqContext } from '@nestjs/microservices';

export function RetryHandler(maxAttempts = 3): MethodDecorator {
  return function (target, key, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const ctx: RmqContext = args[0]; // payload, ctx
      const channel = ctx.getChannelRef();
      const msg = ctx.getMessage();

      let attempt = 0;

      while (attempt < maxAttempts) {
        try {
          const result = await original.apply(this, args);
          channel.ack(msg);
          return result;
        } catch (err) {
          attempt++;
          if (attempt >= maxAttempts) {
            channel.nack(msg, false, false); // dead-letter بعد انتهاء المحاولات
            throw err;
          }
          channel.nack(msg, false, true); // إعادة للمحاولة
        }
      }
    };

    return descriptor;
  };
}

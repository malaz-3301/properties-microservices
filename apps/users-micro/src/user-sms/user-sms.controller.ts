import { Controller, Inject, Logger } from '@nestjs/common';
import { UserSmsService } from './user-sms.service';
import { UsersOtpProvider } from '../users/providers/users-otp.provider';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  RmqRecordBuilder,
} from '@nestjs/microservices';

@Controller()
export class UserSmsController {
  constructor(
    private readonly userSmsService: UserSmsService,
    private readonly usersOtpProvider: UsersOtpProvider,
    @Inject('SMS_SERVICE') private readonly smsClient: ClientProxy, // مشان retry,
  ) {}

  private readonly logger = new Logger(UserSmsController.name);

  @EventPattern('create_user.sms')
  async handleV2(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();
    const retryCount = msg.properties.headers['x-retry-count'] || 1;

    try {
      this.logger.log(`🚀`);
      await this.usersOtpProvider.sendSms(data.phone, data.message);
      channel.ack(msg);
    } catch (err) {
      if (retryCount < 2) {
        channel.ack(msg);
        this.smsClient.emit(
          'create_user.sms',
          new RmqRecordBuilder({
            ...data,
          })
            .setOptions({
              headers: {
                'x-retry-count': retryCount + 1,
              },
              persistent: true,
            })
            .build(),
        );
      } else {
        channel.ack(msg);
        this.logger.error(`🚫`);
      }
    }
  }
}

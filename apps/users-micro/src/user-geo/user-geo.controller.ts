import { Controller, Inject, Logger } from '@nestjs/common';
import { UserGeoService } from './user-geo.service';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  RmqRecordBuilder,
} from '@nestjs/microservices';
import { UsersUpdateProvider } from '../users/providers/users-update.provider';
import { GeolocationService } from '../geolocation/geolocation.service';

@Controller()
export class UserGeoController {
  constructor(
    private readonly userGeoService: UserGeoService,
    private readonly geolocationService: GeolocationService,
    private readonly usersUpdateProvider: UsersUpdateProvider,
    @Inject('GEO_SERVICE') private readonly geoClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(UserGeoController.name);

  @EventPattern('create_user.geo')
  //@Pyaload لفك التشفير
  async handleV1(@Payload() data: any, @Ctx() ctx: RmqContext) {
    // for ack or nack
    const channel = ctx.getChannelRef(); // binding
    const msg = ctx.getMessage();
    const retryCount = msg.properties.headers['x-retry-count'] || 1;

    try {
      this.logger.log(`🚀`);
      const location = await this.geolocationService.reverse_geocoding(
        data.lat,
        data.lon,
      );
      // تحديث بيانات المستخدم بالـ location الجديد
      await this.usersUpdateProvider.updateUserById(data.userId, {
        location: location,
      });
      channel.ack(msg);
    } catch (err) {
      if (retryCount < 2) {
        channel.ack(msg); // لازم ACK قبل ما ترسل نسخة جديدة
        this.geoClient.emit(
          'create_user.geo',
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

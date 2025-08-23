import { Controller, Inject, Logger } from '@nestjs/common';
import { ProGeoService } from './pro-geo.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { PropertiesUpdateProvider } from '../properties/providers/properties-update.provider';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RmqRecordBuilder,
} from '@nestjs/microservices';

@Controller()
export class ProGeoController {
  constructor(
    private readonly proGeoService: ProGeoService,
    private readonly geolocationService: GeolocationService,
    private readonly propertiesUpdateProvider: PropertiesUpdateProvider,
    @Inject('GEO_SERVICE') private readonly geoClient: ClientProxy, // هي مشان اعادة المحاولة ,
  ) {}

  private readonly logger = new Logger(ProGeoController.name);

  // يا راجل الـ message before event
  @MessagePattern('get_property.geo')
  async handleProV1(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const msg: Record<string, any> = ctx.getMessage();
    this.logger.log(`🚀`);
    channel.ack(msg);
    return this.geolocationService.reverse_geocoding(data.lat, data.lon);
  }

  @EventPattern('create_property.geo')
  async handleProV2(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const msg: Record<string, any> = ctx.getMessage();
    const retryCount = msg.properties.headers['x-retry-count'] || 1;
    try {
      this.logger.log(`🚀`);
      const location =
        (await this.geolocationService.reverse_geocoding(data.lat, data.lon)) ||
        {};
      //format
      location['stringPoints'] = {
        type: 'Point',
        coordinates: [data.lon, data.lat],
      };
      // تحديث بيانات المستخدم بال location الجديد
      await this.propertiesUpdateProvider.updateAdminPro(data.proId, {
        location: location,
      });
      /* channel.basicAck(msg.deliveryTag, false);*/
      channel.ack(msg);
    } catch (err) {
      if (retryCount < 2) {
        channel.ack(msg); // لازم ACK قبل ما ترسل نسخة جديدة
        this.geoClient.emit(
          'create_property.geo',
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

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Property } from '../entities/property.entity';
import { DataSource } from 'typeorm';
import { PropertiesVoSuViProvider } from './properties-vo-su-vi.provider';

import { ClientProxy } from '@nestjs/microservices';
import * as console from 'node:console';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import {
  Language,
  PropertyStatus,
  UserType,
} from '@malaz/contracts/utils/enums';
import { firstValueFrom, lastValueFrom, retry, timeout } from 'rxjs';
import { UsersGetProvider } from '../../../../users-micro/src/users/providers/users-get.provider';
import { PropertiesGetProvider } from './properties-get.provider';

@Injectable()
export class PropertiesCreateProvider {
  constructor(
    private readonly propertiesVoViProvider: PropertiesVoSuViProvider,
    private readonly propertiesGetProvider: PropertiesGetProvider,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('TRANSLATE_SERVICE')
    private readonly translateClient: ClientProxy,
    private dataSource: DataSource,
    @Inject('GEO_SERVICE') private readonly geoClient: ClientProxy,
  ) {}

  //create from other
  async create(createPropertyDto: CreatePropertyDto, userId: number) {
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: userId })
        .pipe(retry(2), timeout(5000)),
    );
    //اذا مكتب لازم يشترك
    if (user.userType === UserType.AGENCY) {
      //عدد كم عقار له واختار المحدودية
      const count = await this.propertiesGetProvider.getProsCount(userId);
      if (user.plan?.id === 1) {
        throw new UnauthorizedException('Subscripe ! اشترك في خطط المكاتب');
      }
      if (count >= user.plan?.limit!) {
        throw new UnauthorizedException('limit ! وصلت للحد الأقصى من العقارات');
      }
    }
    console.log('planId : ' + user.plan?.id);

    const agency = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: createPropertyDto.agencyId })
        .pipe(retry(2), timeout(5000)),
    );

    const agencyInfo = await lastValueFrom(
      this.usersClient
        .send('agencies.getOneAgencyInfo', {
          agencyId: createPropertyDto.agencyId,
        })
        .pipe(retry(2), timeout(5000)),
    );
    const { pointsDto } = createPropertyDto;
    /*    const location =
          (await this.geolocationService.reverse_geocoding(
            pointsDto.lat,
            pointsDto.lon,
          )) || {};
        location['stringPoints'] = {
          type: 'Point',
          coordinates: [pointsDto.lon, pointsDto.lat],
        };*/
    const propertyCommissionRate =
      createPropertyDto.price * (agencyInfo.agencyCommissionRate ?? 1);
    const result = await this.dataSource.transaction(async (manger) => {
      let newProperty = manger.create(Property, {
        ...createPropertyDto,
        firstImage: 'https://cdn-icons-png.flaticon.com/512/4757/4757668.png',
        owner: { id: user.id },
        location: { lat: pointsDto.lat, lon: pointsDto.lon },
        agency: { id: agency.id },
        propertyCommissionRate: propertyCommissionRate,
      });
      console.log('cccccccccccccccccccccccccc');
      if (user.id === agency.id) {
        newProperty.status = PropertyStatus.ACCEPTED;
      }
      // await this.createTranslatedProperty(newProperty, createPropertyDto);
      newProperty = await lastValueFrom(
        await this.translateClient.send('translate.createTranslatedProperty', {
          property: newProperty,
          propertyDto: createPropertyDto,
        }),
      );
      await manger.save(Property, newProperty);
      console.log('ddddddddddddddddddddddddddddddd');

      await this.propertiesVoViProvider.computeSuitabilityRatio(
        newProperty,
        manger,
      );
      this.usersClient.emit('analytics.chanePropertiesNum', {
        userId: agency.id,
        value: 1,
      });
      return newProperty;
    });
    //que
    this.geoClient.emit('create_property.geo', {
      proId: result.id,
      lat: pointsDto.lat,
      lon: pointsDto.lon,
    });

    return result.id;
  }
}

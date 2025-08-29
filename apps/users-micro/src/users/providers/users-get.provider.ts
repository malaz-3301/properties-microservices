import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DataSource, FindOptionsWhere, Like, Repository } from 'typeorm';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AgencyInfo } from '../entities/agency-info.entity';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { GeoEnum, Language, UserType } from '@malaz/contracts/utils/enums';
import { FilterUserDto } from '@malaz/contracts/dtos/users/users/filter-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';

@Injectable()
export class UsersGetProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(AgencyInfo)
    private readonly agencyInfoRepository: Repository<AgencyInfo>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
    @Inject('GEO_SERVICE') private readonly geoClient: ClientProxy,
    private dataSource: DataSource,
    @Inject('TRANSLATE_SERVICE')
    private readonly translateClient: ClientProxy,
  ) {}

  // لاعد تسجل otp
  public async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { plan: true, agencyInfo: true },
    });
    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User Not Found',
      });
    }

    console.log(user.userType);

    /*   مؤقت if (user.userType === (UserType.ADMIN || UserType.SUPER_ADMIN)) {
          throw new RpcException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "You Can't its not user or agency",
          });
        }*/
    return user;
  }

  public async getUserProsById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { agencyProperties: true },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    /*    if (user.userType === UserType.SUPER_ADMIN) {
          throw new UnauthorizedException("You Can't");
        }*/
    return user;
  }

  public async findByIdOtp(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { otpEntity: true },
      select: {
        otpEntity: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User or otp Not Found');
    }
    /*    if (user.userType === UserType.SUPER_ADMIN) {
          throw new UnauthorizedException("You Can't");
        }*/
    return user;
  }

  async getAdminById(adminId: number) {
    //تحقق
    return await this.usersRepository.findOne({
      where: { id: adminId },
      relations: { audits: true },
    });
  }

  async getOneAgency(agencyId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: agencyId },
      relations: ['agencyInfo'],
    });
    const properties = await lastValueFrom(
      this.propertiesClient.send('properties.getAgencyAndPros', {
        agencyId: agencyId,
      }),
    );
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return {
      ...user,
      properties,
    };
  }

  async getOneAgencyInfo(agencyId: number) {
    const agencyInfo = await this.agencyInfoRepository.findOneBy({
      user_id: agencyId,
    });
    if (!agencyInfo) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No users found',
      });
    }
    return agencyInfo;
  }

  async getAll(query: FilterUserDto) {
    const { word, role } = query;
    const filters: FindOptionsWhere<User>[] = [];

    const key = await this.shortHash(query);
    const cacheData = await this.cacheManager.get(key);
    if (cacheData) {
      console.log('This is Cache data');
      return cacheData;
    }
    // شرط البحث
    if (word) {
      const cacheData = await this.cacheManager.get('users');
      if (cacheData) {
        console.log('Cache data'); //
        return cacheData;
      }
      filters.push({ username: Like(`%${word}%`) });
    }
    if (role != null) {
      filters.push({ userType: role });
      console.log(role);
    }

    // شروط السعر

    const where = Object.assign({}, ...filters);
    console.log(where);

    const users: User[] = await this.usersRepository.find({
      where,
    });
    if (!users || users.length === 0) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No users found',
      });
    }

    await this.cacheManager.set(key, users);
    return users;
  }

  async shortHash(obj: object) {
    //ينشئ كائن تجزئة باستخدام خوارزمية MD5
    return createHash('md5').update(JSON.stringify(obj)).digest('hex');
  }

  async translate(targetLang: Language, text: string) {
    const Url = this.configService.get<string>('TRANSLATE');
    const sourceLang = Language.ARABIC;
    const Url1 =
      Url +
      `?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    let translatedText;
    await fetch(Url1)
      .then((response) => response.json())
      .then((data) => {
        translatedText = data[0][0][0];
      })
      .catch((error) => {
        console.error('حدث خطأ:', error);
        console.log(Url1);
      });
    return translatedText;
  }

  public async findByPhone(phone: string) {
    const user = await this.usersRepository.findOne({
      where: { phone },
      relations: { plan: true },
    });
    if (!user) {
      return user;
    }

    console.log(user.userType);
    if (user.userType === (UserType.ADMIN || UserType.SUPER_ADMIN)) {
      throw new UnauthorizedException("You Can't its not user or agency");
    }
    return user;
  }

  async getUserByGeo(geoProDto: GeoProDto, userId: number) {
    const level = geoProDto.geoLevel;
    /*    const location =
          (await this.geolocationService.reverse_geocoding(
            geoProDto.lat,
            geoProDto.lon,
          )) || {};*/
    console.log('helooooooooooo');
    const location = await firstValueFrom(
      this.geoClient.send('get_property.geo', {
        lat: geoProDto.lat,
        lon: geoProDto.lon,
      }),
    );

    //نزيل بعدين طلاع
    const GeoArray = Object.values(GeoEnum); //عملها مصفوفة
    console.log(location);
    const key = GeoArray.indexOf(level);
    let apiGeoLevel;
    let apiGeoValue;

    if (location[level] != null && location[level] != 'unnamed road') {
      apiGeoLevel = level;
      apiGeoValue = location[`${GeoArray[key]}`];
    } else {
      let i = key - 1;
      while (i >= 0) {
        console.log('aaa');
        if (
          location[GeoArray[i]] != 'unnamed road' &&
          location[GeoArray[i]] != null
        ) {
          apiGeoLevel = GeoArray[i];
          apiGeoValue = location[GeoArray[i]];
          console.log(
            GeoArray[i] + ' : ' + i + ' ' + location[`${GeoArray[i]}`],
          );
          break;
        }
        i--;
      }
      console.log('break');
      if (apiGeoValue == null) {
        i = key + 2;

        while (i <= 4) {
          if (
            location[GeoArray[i]] != 'unnamed road' &&
            location[GeoArray[i]] != null
          ) {
            apiGeoLevel = GeoArray[i];
            apiGeoValue = location[GeoArray[i]];
            console.log(
              GeoArray[i] + ' : ' + i + ' ' + location[`${GeoArray[i]}`],
            );
            break;
          }
          i++;
        }
      }
    }
    console.log('last_level is :' + apiGeoLevel + ' : ' + apiGeoValue);
    let properties = await this.usersRepository.find({
      where: { location: { [apiGeoLevel]: apiGeoValue } },
    });
    const users = await this.findById(userId);
    // this.getTranslatedProperty(properties[i], user.language);
    return users;
  }

  async getUserNearMe(nearProDto: NearProDto, userId: number) {
    let result = await this.dataSource.query(
      `
          SELECT *,
                 ST_Distance(
                         "locationStringpoints",
                         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                 ) AS distance
          FROM users
          WHERE ST_DWithin(
                        "locationStringpoints",
                        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                        $3
                )
          ORDER BY distance ASC;
      `,
      [nearProDto.lon, nearProDto.lat, nearProDto.distanceKm],
    );
    const user = await this.findById(userId);
    result = await lastValueFrom(
      this.translateClient.send('translate.getTranslatedProperties', {
        property: result,
        language: user.language,
      }),
    );
    return result;
  }
}

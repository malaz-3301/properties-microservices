import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { PropertyStatus } from '@malaz/contracts/utils/enums';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Throttle } from '@nestjs/throttler';
import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout } from 'rxjs/operators';

@Controller('properties')
export class ToPropertiesPropertiesController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Get('all')
  @UseGuards(AuthGuard)
  getAllAccepted(
    @Query() query: FilterPropertyDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    query.status = PropertyStatus.ACCEPTED;
    return this.propertiesClient
      .send('property.getAllAccepted', { query, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('geo')
  @UseGuards(AuthGuard)
  getProByGeo(
    @Query() geoProDto: GeoProDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getProByGeo', { geoProDto, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('near')
  getProNearMe(@Query() nearProDto: NearProDto) {
    return this.propertiesClient
      .send('property.getProNearMe', { nearProDto })
      .pipe(retry(2), timeout(5000));
  }

  @Get('top/:limit')
  @UseInterceptors(CacheInterceptor)
  getTopScorePro(@Param('limit', ParseIntPipe) limit: number) {
    return this.propertiesClient
      .send('property.getTopScorePro', { limit })
      .pipe(retry(2), timeout(5000));
  }

  @Get(':proId')
  @UseGuards(AuthGuard)
  @Throttle({ default: { ttl: 10000, limit: 5 } })
  getOnePro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getOnePro', { proId, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  /* @Patch('acc/:proId')
  acceptProById(...) {...}

  @Patch('rej/:id')
  rejectProById(...) {...} */
}

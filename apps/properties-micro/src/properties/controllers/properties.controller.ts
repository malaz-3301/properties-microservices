import { Controller } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { PropertyStatus } from '@malaz/contracts/utils/enums';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // قائمة العقارات المقبولة
  @MessagePattern('properties.getAllAccepted')
  async getAllAccepted(
    @Payload() payload: { query: FilterPropertyDto; user?: number },
  ) {
    const { query, user } = payload;
    query.status = PropertyStatus.ACCEPTED;
    console.log(`user ${user}`);
    if (user) return this.propertiesService.getAll(query, user);
    return this.propertiesService.getAll(query);
  }

  @MessagePattern('properties.getProByGeo')
  async getProByGeo(
    @Payload() payload: { geoProDto: GeoProDto; userId: number },
  ) {
    return this.propertiesService.getProByGeo(
      payload.geoProDto,
      payload.userId,
    );
  }

  // عقارات قريبة مني
  @MessagePattern('properties.getNearMe')
  async getProNearMe(
    @Payload() payload: { nearProDto: NearProDto; userId: number },
  ) {
    return this.propertiesService.getProNearMe(
      payload.nearProDto,
      payload.userId,
    );
  }

  // أفضل العقارات بحسب النقاط
  @MessagePattern('properties.getTopScore')
  async getTopScorePro(@Payload() payload: { limit: number }) {
    return this.propertiesService.getTopScorePro(payload.limit);
  }

  // جلب عقار واحد
  @MessagePattern('properties.getOne')
  async getOnePro(@Payload() payload: { proId: number; userId: number }) {
    return this.propertiesService.getOnePro(payload.proId, payload.userId);
  }

  @MessagePattern('properties.uploadSingleImg')
  async uploadSingleImg(
    @Payload()
    payload: {
      proId: number;
      userId: number;
      filename: string;
    },
  ) {
    return this.propertiesService.setSingleImg(
      payload.proId,
      payload.userId,
      payload.filename,
    );
  }

  // رفع عدة صور
  @MessagePattern('properties.uploadMultiImg')
  async uploadMultiImg(
    @Payload()
    payload: {
      proId: number;
      userId: number;
      filenames?: string[];
    },
  ) {
    return this.propertiesService.setMultiImg(
      payload.proId,
      payload.userId,
      payload.filenames || [],
    );
  }

  // رفع بانوراما متعددة
  @MessagePattern('properties.uploadMultiPanorama')
  async uploadMultiPanorama(
    @Payload()
    payload: {
      proId: number;
      userId: number;
      panoramaNames: string[];
      filenames: string[];
    },
  ) {
    return this.propertiesService.setMultiPanorama(
      payload.proId,
      payload.userId,
      payload.panoramaNames,
      payload.filenames,
    );
  }

  /*
    @MessagePattern('properties.removeAnyImg')
    async removeAnyImg(
      @Payload()
      payload: {
        proId: number;
        userId: number;
        imageName: string;
      },
    ) {
      return this.propertiesService.removeAnyImg(
        payload.proId,
        payload.userId,
        payload.imageName,
      );
    }*/
}

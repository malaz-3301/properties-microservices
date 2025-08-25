import { Controller } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';
import { DeleteUserDto } from '@malaz/contracts/dtos/users/users/delete-user.dto';

@Controller('properties-on')
export class PropertiesOnController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // إنشاء عقار
  @MessagePattern('properties.create')
  async create(
    @Payload()
    payload: {
      createPropertyDto: CreatePropertyDto;
      owner: number;
    },
  ) {
    console.log('mohammed12');
    return this.propertiesService.create(
      payload.createPropertyDto,
      payload.owner,
    );
  }

  // جلب عقاراتي
  @MessagePattern('properties.getOwnerPros')
  async getOwnerPros(
    @Payload() payload: { ownerId: number; query: FilterPropertyDto },
  ) {
    return this.propertiesService.getAll(
      payload.query,
      payload.ownerId,
      payload.ownerId,
      undefined,
    );
  }

  // تحديث عقاري
  @MessagePattern('properties.updateOwnerPro')
  async updateOwnerPro(
    @Payload()
    payload: {
      proId: number;
      ownerId: number;
      updatePropertyDto: UpdatePropertyDto;
    },
  ) {
    return this.propertiesService.updateOwnerPro(
      payload.proId,
      payload.ownerId,
      payload.updatePropertyDto,
    );
  }

  // حذف عقاري
  @MessagePattern('properties.deleteOwnerPro')
  async deleteOwnerPro(
    @Payload()
    payload: {
      proId: number;
      userId: number;
      password: string;
    },
  ) {
    return this.propertiesService.deleteOwnerPro(
      payload.proId,
      payload.userId,
      payload.password,
    );
  }

  /*  // رفع صورة واحدة
    @MessagePattern('properties.upload.single')مؤقت مؤقت
    async uploadSingleImg(
      @Payload() payload: { id: number; owner: JwtPayloadType; filename?: string },
    ) {
      return this.propertiesService.setSingleImg(payload.id, payload.owner.id, payload.filename);
    }*/

  // رفع عدة صور
  @MessagePattern('properties.uploadMultiImg')
  async uploadMultiImg(
    @Payload()
    payload: {
      id: number;
      owner: JwtPayloadType;
      filenames?: string[];
    },
  ) {
    return this.propertiesService.setMultiImg(
      payload.id,
      payload.owner.id,
      payload.filenames || [],
    );
  }

  // رفع بانوراما متعددة
  @MessagePattern('properties.uploadMultiPanorama')
  async uploadMultiPanorama(
    @Payload()
    payload: {
      id: number;
      owner: JwtPayloadType;
      panoramaNames: string[];
      filenames: string[];
    },
  ) {
    return this.propertiesService.setMultiPanorama(
      payload.id,
      payload.owner.id,
      payload.panoramaNames,
      payload.filenames,
    );
  }

  /*  // حذف أي صورة لعقار
  @MessagePattern('properties.removeAnyImg')مؤقت مؤقت
  async removeAnyImg(
    @Payload() payload: { id: number; imageName: string; user?: JwtPayloadType },
  ) {
    return this.propertiesService.removeAnyImg(payload.id, payload.user?.id, payload.imageName);
  }*/
}

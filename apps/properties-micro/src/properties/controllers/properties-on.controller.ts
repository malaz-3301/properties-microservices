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
      owner: JwtPayloadType;
    },
  ) {
    return this.propertiesService.create(
      payload.createPropertyDto,
      payload.owner.id,
    );
  }

  // جلب عقاراتي
  @MessagePattern('properties.owner.getMy')
  async getOwnerPros(
    @Payload() payload: { owner: JwtPayloadType; query: FilterPropertyDto },
  ) {
    return this.propertiesService.getAll(
      payload.query,
      payload.owner.id,
      payload.owner.id,
      undefined,
    );
  }

  // تحديث عقاري
  @MessagePattern('properties.owner.update')
  async updateOwnerPro(
    @Payload()
    payload: {
      proId: number;
      owner: JwtPayloadType;
      updatePropertyDto: UpdatePropertyDto;
    },
  ) {
    return this.propertiesService.updateOwnerPro(
      payload.proId,
      payload.owner.id,
      payload.updatePropertyDto,
    );
  }

  // حذف عقاري
  @MessagePattern('properties.owner.delete')
  async deleteOwnerPro(
    @Payload()
    payload: {
      proId: number;
      user: JwtPayloadType;
      deleteUserDto: DeleteUserDto;
    },
  ) {
    return this.propertiesService.deleteOwnerPro(
      payload.proId,
      payload.user.id,
      payload.deleteUserDto.password,
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
  @MessagePattern('properties.upload.multiple')
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
  @MessagePattern('properties.upload.panorama')
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

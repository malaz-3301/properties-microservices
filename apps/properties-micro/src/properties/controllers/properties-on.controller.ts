import { Controller } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';

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
}

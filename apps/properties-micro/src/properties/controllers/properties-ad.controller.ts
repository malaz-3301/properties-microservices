import { Controller } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { PropertyStatus } from '@malaz/contracts/utils/enums';
import { UpdateProAdminDto } from '@malaz/contracts/dtos/properties/properties/update-pro-admin.dto';

@Controller('properties-ad')
export class PropertiesAdController {
  constructor(private readonly propertiesService: PropertiesService) {}

  //  جلب الكل
  @MessagePattern('properties.getAll')
  async getAll(
    @Payload() payload: { query: FilterPropertyDto; userId?: number },
  ) {
    return this.propertiesService.getAll(payload.query, payload.userId);
  }

  // جلب المعلقة
  @MessagePattern('properties.getAllPending')
  async getAllPending(
    @Payload() payload: { query: FilterPropertyDto; userId?: number },
  ) {
    const query = payload.query || {};
    query.status = PropertyStatus.PENDING;
    return this.propertiesService.getAll(query, payload.userId);
  }

  // تحديث
  @MessagePattern('properties.updateAdmin')
  async updateAdminPro(
    @Payload() payload: { id: number; updateProAdminDto: UpdateProAdminDto },
  ) {
    return this.propertiesService.updateAdminPro(
      payload.id,
      payload.updateProAdminDto,
    );
  }

  //  حذف
  @MessagePattern('properties.deleteAdminPro')
  async deleteAdminPro(@Payload() payload: { id: number }) {
    return this.propertiesService.deleteProById(+payload.id);
  }
}

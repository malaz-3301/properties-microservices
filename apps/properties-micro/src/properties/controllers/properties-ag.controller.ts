import { Controller } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';

@Controller('properties-ag')
export class PropertiesAgController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // بحث جغرافي
  @MessagePattern('properties.getByGeo')
  async getProByGeo(
    @Payload() payload: { geoProDto: GeoProDto; user?: JwtPayloadType },
  ) {
    const { geoProDto, user } = payload;
    const userId = user?.id!;
    return this.propertiesService.getProByGeo(geoProDto, userId);
  }

  // جلب العقارات المعلقة للوكالة
  @MessagePattern('properties.getPendingAgency')
  async getAllPendingAgency(
    @Payload() payload: { query: FilterPropertyDto; agency: JwtPayloadType },
  ) {
    return this.propertiesService.getAllPendingAgency(
      payload.query,
      payload.agency.id,
      undefined,
      payload.agency.id,
    );
  }

  // تحديث عقار عبر الوكالة
  @MessagePattern('properties.updateAgency')
  async updateAgencyPro(
    @Payload()
    payload: {
      proId: number;
      agency: JwtPayloadType;
      editProAgencyDto: EditProAgencyDto;
    },
  ) {
    return this.propertiesService.updateAgencyPro(
      payload.proId,
      payload.agency.id,
      payload.editProAgencyDto,
    );
  }

  // قبول عقار من الوكالة
  @MessagePattern('properties.acceptAgency')
  async acceptAgencyPro(
    @Payload() payload: { proId: number; agency: JwtPayloadType },
  ) {
    return this.propertiesService.acceptAgencyPro(
      payload.proId,
      payload.agency.id,
    );
  }

  // رفض عقار من الوكالة
  @MessagePattern('properties.rejectAgency')
  async rejectAgencyPro(
    @Payload() payload: { id: number; agency: JwtPayloadType },
  ) {
    return this.propertiesService.rejectAgencyPro(
      payload.id,
      payload.agency.id,
    );
  }

  /*
  // حذف عقار بواسطة الوكالة — كانت معلّقة في الكود الأصلي (DELETE /delete)
  // لو أردت تفعيلها: اعطها routing key مناسب مثل 'properties.agency.delete'
  @MessagePattern('properties.agency.delete')
  async deleteAgencyPro(
    @Payload() payload: { proId: number; agency: JwtPayloadType },
  ) {
    return this.propertiesService.deleteProById(payload.proId);
  }*/
}

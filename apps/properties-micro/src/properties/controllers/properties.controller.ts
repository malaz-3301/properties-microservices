import { Controller } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
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

  /*  // إرجاع معلومات ملف الصورة
    @MessagePattern('properties.getImage') // مؤقت رجعها من gateway
    async showUploadedImage(
      @Payload() payload: { imageName: string },
    ) {
      return this.propertiesService.getImageFileInfo(payload.imageName);
    }*/

  // قبول عقار من الوكالة
  // @MessagePattern('properties.acceptAgency')
  // async acceptAgencyPro(
  //   @Payload() payload: { proId: number; agency: JwtPayloadType },
  // ) {
  //   return this.propertiesService.acceptAgencyPro(
  //     payload.proId,
  //     payload.agency.id,
  //   );
  // }

  // جلب عقارات الوكالة
  // @MessagePattern('properties.getAgencyPros')
  // async getAgencyPros(
  //   @Payload() payload: { query: FilterPropertyDto; agencyId: number },
  // ) {
  //   return this.propertiesService.getAll(
  //     payload.query,
  //     payload.agencyId,
  //     undefined,
  //     payload.agencyId,
  //   );
  // }

  /*
  // حذف عقار بواسطة الوكالة — كانت معلّقة في الكود الأصلي (DELETE /delete)
  // لو أردت تفعيلها: اعطها routing key مناسب مثل 'properties.agency.delete'
  @MessagePattern('properties.agency.delete')
  async deleteAgencyPro(
    @Payload() payload: { proId: number; agency: JwtPayloadType },
  ) {
    return this.propertiesService.deleteProById(payload.proId);
  }*/

  /*

  // قبول عقار (admin) — كانت معلّقة في الكود الأصلي
  // payload المتوقع: { proId: number, acceptProAdminDto: AcceptProAdminDto }
  @MessagePattern('properties.admin.accept')
  async acceptProById(
    @Payload() payload: { proId: number; acceptProAdminDto: any }, // AcceptProAdminDto
  ) {
    return this.propertiesService.acceptPro(payload.proId, payload.acceptProAdminDto);
  }

  // رفض عقار (admin) — كانت معلّقة في الكود الأصلي
  // payload المتوقع: { id: number, rejectProAdminDto: RejectProAdminDto }
  @MessagePattern('properties.admin.reject')
  async rejectProById(
    @Payload() payload: { id: number; rejectProAdminDto: any }, // RejectProAdminDto
  ) {
    return this.propertiesService.rejectPro(payload.id, payload.rejectProAdminDto);
  }
  */
}

import { Controller } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Payload } from '@nestjs/microservices';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { PropertyStatus } from '@malaz/contracts/utils/enums';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';
import { UpdateProAdminDto } from '@malaz/contracts/dtos/properties/properties/update-pro-admin.dto';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';
import { DeleteUserDto } from '@malaz/contracts/dtos/users/users/delete-user.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('properties')
export class PropertiesController {

  constructor(private readonly propertiesService: PropertiesService) {}

  // قائمة العقارات المقبولة
  @MessagePattern('properties.getAllAccepted')
  async getAllAccepted(
    @Payload() payload: { query: FilterPropertyDto, user?: JwtPayloadType },
  ) {
    const { query , user } = payload;
    query.status = PropertyStatus.ACCEPTED;
    if (user) return this.propertiesService.getAll(query, user.id);
    return this.propertiesService.getAll(query);
  }

  // بحث جغرافي
  @MessagePattern('properties.getByGeo')
  async getProByGeo(
    @Payload() payload: { geoProDto: GeoProDto, user?: JwtPayloadType },
  ) {
    const { geoProDto, user } = payload;
    const userId = user?.id!;
    return this.propertiesService.getProByGeo(geoProDto, userId);
  }

  // عقارات قريبة مني
  @MessagePattern('properties.getNearMe')
  async getProNearMe(
    @Payload() payload: { nearProDto: NearProDto },
  ) {
    return this.propertiesService.getProNearMe(payload.nearProDto);
  }

  // أفضل العقارات بحسب النقاط
  @MessagePattern('properties.getTopScore')
  async getTopScorePro(
    @Payload() payload: { limit: number },
  ) {
    return this.propertiesService.getTopScorePro(payload.limit);
  }

  // جلب عقار واحد
  @MessagePattern('properties.getOne')
  async getOnePro(
    @Payload() payload: { proId: number; user?: JwtPayloadType },
  ) {
    const userId = payload.user?.id!;
    return this.propertiesService.getOnePro(payload.proId, userId);
  }

  /*  // إرجاع معلومات ملف الصورة
    @MessagePattern('properties.getImage') // مؤقت رجعها من gateway
    async showUploadedImage(
      @Payload() payload: { imageName: string },
    ) {
      return this.propertiesService.getImageFileInfo(payload.imageName);
    }*/

  // تحديث عقار عبر الوكالة
  @MessagePattern('properties.updateAgency')
  async updateAgencyPro(
    @Payload()
    payload: { proId: number; agency: JwtPayloadType; editProAgencyDto: EditProAgencyDto },
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
    return this.propertiesService.acceptAgencyPro(payload.proId, payload.agency.id);
  }

  // رفض عقار من الوكالة
  @MessagePattern('properties.rejectAgency')
  async rejectAgencyPro(
    @Payload() payload: { id: number; agency: JwtPayloadType },
  ) {
    return this.propertiesService.rejectAgencyPro(payload.id, payload.agency.id);
  }

  // جلب عقارات الوكالة
  @MessagePattern('properties.getAgencyPros')
  async getAgencyPros(
    @Payload() payload: { query: FilterPropertyDto; agency: JwtPayloadType },
  ) {
    return this.propertiesService.getAll(payload.query, payload.agency.id, undefined, payload.agency.id);
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

  /*  // حذف أي صورة لعقار
    @MessagePattern('properties.removeAnyImg')مؤقت مؤقت
    async removeAnyImg(
      @Payload() payload: { id: number; imageName: string; user?: JwtPayloadType },
    ) {
      return this.propertiesService.removeAnyImg(payload.id, payload.user?.id, payload.imageName);
    }*/

  // تحديث
  @MessagePattern('properties.updateAdmin')
  async updateAdminPro(
    @Payload() payload: { id: number; updateProAdminDto: UpdateProAdminDto },
  ) {
    return this.propertiesService.updateAdminPro(payload.id, payload.updateProAdminDto);
  }

  //  جلب الكل
  @MessagePattern('properties.admin.getAll')
  async getAll(
    @Payload() payload: { query: FilterPropertyDto; user?: JwtPayloadType },
  ) {
    return this.propertiesService.getAll(payload.query, payload.user?.id);
  }

  // جلب المعلقة
  @MessagePattern('properties.admin.getPending')
  async getAllPending(
    @Payload() payload: { query: FilterPropertyDto; user?: JwtPayloadType },
  ) {
    const query = payload.query || {};
    query.status = PropertyStatus.PENDING;
    return this.propertiesService.getAll(query, payload.user?.id);
  }

  //  حذف
  @MessagePattern('properties.admin.delete')
  async deleteAdminPro(
    @Payload() payload: { id: number },
  ) {
    return this.propertiesService.deleteProById(+payload.id);
  }

  // إنشاء عقار
  @MessagePattern('properties.create')
  async create(
    @Payload() payload: { createPropertyDto: CreatePropertyDto; owner: JwtPayloadType },
  ) {
    return this.propertiesService.create(payload.createPropertyDto, payload.owner.id);
  }

  // جلب عقاراتي
  @MessagePattern('properties.owner.getMy')
  async getOwnerPros(
    @Payload() payload: { owner: JwtPayloadType; query: FilterPropertyDto },
  ) {
    return this.propertiesService.getAll(payload.query, payload.owner.id, payload.owner.id, undefined);
  }

  // تحديث عقاري
  @MessagePattern('properties.owner.update')
  async updateOwnerPro(
    @Payload() payload: { proId: number; owner: JwtPayloadType; updatePropertyDto: UpdatePropertyDto },
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
    @Payload() payload: { proId: number; user: JwtPayloadType; deleteUserDto: DeleteUserDto },
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
    @Payload() payload: { id: number; owner: JwtPayloadType; filenames?: string[] },
  ) {
    return this.propertiesService.setMultiImg(payload.id, payload.owner.id, payload.filenames || []);
  }

  // رفع بانوراما متعددة
  @MessagePattern('properties.upload.panorama')
  async uploadMultiPanorama(
    @Payload() payload: { id: number; owner: JwtPayloadType; panoramaNames: string[]; filenames: string[] },
  ) {
    return this.propertiesService.setMultiPanorama(
      payload.id,
      payload.owner.id,
      payload.panoramaNames,
      payload.filenames,
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
  }

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

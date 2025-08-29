import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertiesImgProvider } from './providers/properties-img.provider';
import { PropertiesDelProvider } from './providers/properties-del.provider';
import { PropertiesGetProvider } from './providers/properties-get.provider';
import { PropertiesUpdateProvider } from './providers/properties-update.provider';
import { PropertiesVoSuViProvider } from './providers/properties-vo-su-vi.provider';
import { PropertiesCreateProvider } from './providers/properties-create.provider';
import { ConfigService } from '@nestjs/config';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';
import { UpdateProAdminDto } from '@malaz/contracts/dtos/properties/properties/update-pro-admin.dto';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { PropertyStatus, UserType } from '@malaz/contracts/utils/enums';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private dataSource: DataSource,
    private readonly propertiesVoViProvider: PropertiesVoSuViProvider,
    private readonly propertiesUpdateProvider: PropertiesUpdateProvider,
    private readonly propertiesImgProvider: PropertiesImgProvider,
    private readonly propertiesDelProvider: PropertiesDelProvider,
    private readonly propertiesGetProvider: PropertiesGetProvider,
    private readonly propertiesCreateProvider: PropertiesCreateProvider,
    private readonly configService: ConfigService,
  ) {}

  //create from other
  create(createPropertyDto: CreatePropertyDto, ownerId: number) {
    return this.propertiesCreateProvider.create(createPropertyDto, ownerId);
  }

  updateOwnerPro(
    proId: number,
    userId: number,
    updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesUpdateProvider.updateOwnerPro(
      proId,
      userId,
      updatePropertyDto,
    );
  }

  updateAdminPro(proId: number, updateProAdminDto: UpdateProAdminDto) {
    return this.propertiesUpdateProvider.updateAdminPro(
      proId,
      updateProAdminDto,
    );
  }

  updateAgencyPro(
    proId: number,
    agencyId: number,
    editProAgencyDto: EditProAgencyDto,
  ) {
    return this.propertiesUpdateProvider.updateAgencyPro(
      proId,
      agencyId,
      editProAgencyDto,
    );
  }

  acceptAgencyPro(proId: number, agencyId: number) {
    return this.propertiesUpdateProvider.acceptAgencyPro(proId, agencyId);
  }

  async rejectAgencyPro(proId: number, agencyId: number) {
    return this.propertiesUpdateProvider.rejectAgencyPro(proId, agencyId);
  }

  getAll(
    query: FilterPropertyDto,
    userId?: number,
    ownerId?: number,
    agencyId?: number,
  ) {
    return this.propertiesGetProvider.getAll(query, userId, ownerId, agencyId);
  }

  getAllPendingAgency(
    query: FilterPropertyDto,
    userId?: number,
    ownerId?: number,
    agencyId?: number,
  ) {
    query.status = PropertyStatus.PENDING;
    return this.propertiesGetProvider.getAll(query, userId, ownerId, agencyId);
  }

  async getOnePro(proId: number, userId: number) {
    return this.propertiesGetProvider.findById_ACT(proId, userId);
  }

  async getUserPro(proId: number, userId: number, role: UserType) {
    return this.propertiesGetProvider.getProByUser(proId, userId, role);
  }

  async getProByGeo(geoProDto: GeoProDto, userId: number) {
    return this.propertiesGetProvider.getProByGeo(geoProDto, userId);
  }

  async getProNearMe(nearProDto: NearProDto, userId: number) {
    return this.propertiesGetProvider.getProNearMe(nearProDto, userId);
  }

  async deleteOwnerPro(proId: number, userId: number, password: string) {
    return this.propertiesDelProvider.deleteOwnerPro(proId, userId, password);
  }

  async deleteProById(id: number) {
    return this.propertiesDelProvider.deleteProById(id);
  }

  async setSingleImg(id: number, userId: number, filename: string) {
    return this.propertiesImgProvider.setSingleImg(id, userId, filename);
  }

  async setMultiImg(id: number, userId: number, filenames: string[]) {
    return this.propertiesImgProvider.setMultiImg(id, userId, filenames);
  }

  async setMultiPanorama(
    id: number,
    userId: number,
    panoramaNames: string[],
    filenames: string[],
  ) {
    return this.propertiesImgProvider.setMultiPanorama(
      id,
      userId,
      panoramaNames,
      filenames,
    );
  }

  /*  async removeSingleImage(id: number, userId: number) {
      return this.propertiesImgProvider.removeSingleImage(id, userId);
    }*/

  async computePropertySuitability(
    property: Property,
    manager?: EntityManager,
  ) {
    return this.propertiesVoViProvider.computeSuitabilityRatio(
      property,
      manager,
    );
  }

  getTopScorePro(limit: number) {
    return this.propertiesGetProvider.getTopScorePro(limit);
  }
}

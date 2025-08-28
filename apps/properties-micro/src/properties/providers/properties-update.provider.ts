import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { Repository } from 'typeorm';
import { PropertiesGetProvider } from './properties-get.provider';
import {
  Language,
  PropertyStatus,
  UserType,
} from '@malaz/contracts/utils/enums';
import { UsersGetProvider } from '../../../../users-micro/src/users/providers/users-get.provider';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';
import {
  ClientProxy,
  RmqRecordBuilder,
  RpcException,
} from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { firstValueFrom, lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class PropertiesUpdateProvider {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private readonly propertiesGetProvider: PropertiesGetProvider,
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('TRANSLATE_SERVICE')
    private readonly translateClient: ClientProxy,
    @Inject('SMS_SERVICE') private readonly client2: ClientProxy,
    private i18n: I18nService,
  ) {}

  async updateOwnerPro(
    proId: number,
    ownerId: number,
    updatePropertyDto: UpdatePropertyDto,
  ) {
    let property = await this.propertiesGetProvider.getProByUser(
      proId,
      ownerId,
      UserType.Owner,
    );
    if (property?.status === PropertyStatus.ACCEPTED) {
      throw new UnauthorizedException(
        "You can't update the property has been published",
      );
    }
    if (!property) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Empty',
      });
    }
    // await this.updateTranslatedProperty(property, updatePropertyDto);
    property = await lastValueFrom(
      await this.translateClient.send('translate.updateTranslatedProperty', {
        property: property,
        propertyDto: updatePropertyDto,
      }),
    );
    return this.propertyRepository.save({ ...property, ...updatePropertyDto });
  }

  async updateAgencyPro(
    proId: number,
    agencyId: number,
    editProAgencyDto: EditProAgencyDto,
  ) {
    let property = await this.propertiesGetProvider.getProByUser(
      proId,
      agencyId,
      UserType.AGENCY,
    );
    // await this.updateTranslatedProperty(property, editProAgencyDto);
    property = await lastValueFrom(
      await this.translateClient.send('translate.updateTranslatedProperty', {
        property: property,
        propertyDto: editProAgencyDto,
      }),
    );
    return this.propertyRepository.save({ ...property, ...editProAgencyDto });
  }

  async acceptAgencyPro(proId: number, agencyId: number) {
    const property = await this.propertiesGetProvider.getProByUser(
      proId,
      agencyId,
      UserType.AGENCY,
    );
    if (!property) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Empty',
      });
    }
    const updatedProperty = await this.propertyRepository.update(proId, {
      status: PropertyStatus.ACCEPTED,
    });
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: property.owner.id })
        .pipe(retry(2), timeout(5000)),
    );
    const accept = this.i18n.t('transolation.AcceptMessage', {
      lang: user.language,
    });
    console.log(accept);
    this.client2.emit(
      'create_user.sms',
      new RmqRecordBuilder({
        phone: user.phone,
        message: `${accept}`,
      })
        .setOptions({ persistent: true })
        .build(),
    );
    return updatedProperty;
  }

  async rejectAgencyPro(proId: number, agencyId: number) {
    const property = await this.propertiesGetProvider.getProByUser(
      proId,
      agencyId,
      UserType.AGENCY,
    );
    if (!property) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Empty',
      });
    }
    const updatedProperty = await this.propertyRepository.update(proId, {
      status: PropertyStatus.Rejected,
    });
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: property.owner.id })
        .pipe(retry(2), timeout(5000)),
    );
    const reject = this.i18n.t('transolation.RejectMessage', {
      lang: user.language,
    });
    console.log(reject);
    this.client2.emit(
      'create_user.sms',
      new RmqRecordBuilder({
        phone: user.phone,
        message: `${reject}`,
      })
        .setOptions({ persistent: true })
        .build(),
    );
    return updatedProperty;
    /*    return this.usersOtpProvider.sendSms(
          property.owner.phone,
          rejectProAdminDto.message,
        );*/
  }

  async updateAdminPro(proId: number, update: any) {
    let property = await this.propertiesGetProvider.findById(proId);
    // await this.updateTranslatedProperty(property, update);
    property = await lastValueFrom(
      await this.translateClient.send('translate.updateTranslatedProperty', {
        property: property,
        propertyDto: update,
      }),
    );
    return this.propertyRepository.save({ ...property, ...update });
  }

  async markCommissionPaid(proId: number) {
    return this.propertyRepository.update(proId, {
      commissionPaid: true,
    });
  }
}

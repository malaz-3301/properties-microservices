import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { FilterPropertyDto } from '@malaz/contracts/dtos/properties/properties/filter-property.dto';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { PropertyStatus, UserType } from '@malaz/contracts/utils/enums';
import { AuditInterceptor } from '@malaz/contracts/utils/interceptors/audit.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePropertyDto } from '@malaz/contracts/dtos/properties/properties/create-property.dto';
import { UpdatePropertyDto } from '@malaz/contracts/dtos/properties/properties/update-property.dto';
import { DeleteUserDto } from '@malaz/contracts/dtos/users/users/delete-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PanoramaPro } from '@malaz/contracts/dtos/properties/properties/panorama-pro.dto';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { EditProAgencyDto } from '@malaz/contracts/dtos/properties/properties/edit-pro-agency.dto';
import { UpdateProAdminDto } from '@malaz/contracts/dtos/properties/properties/update-pro-admin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { retry, timeout } from 'rxjs/operators';
import { Response } from 'express';

@Controller('properties')
export class ToPropertiesPropertiesController {
  constructor(
    @Inject('PROPERTIES_SERVICES')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() owner: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.create', { dto: createPropertyDto, ownerId: owner.id })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upload-img/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('property-image'))
  uploadSingleImg(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.propertiesClient
      .send('property.uploadSingleImg', { id, userId: payload.id, file })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upload-multiple-img/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('property-images', 8))
  uploadMultiImg(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No file uploaded');
    const filenames = files.map((f) => f.filename);
    return this.propertiesClient
      .send('property.uploadMultiImg', { id, userId: payload.id, filenames })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upload-multiple-pan/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('property-images', 8))
  uploadMultiPanorama(
    @Param('id', ParseIntPipe) id: number,
    @Query() panoramaPro: PanoramaPro,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No file uploaded');
    const filenames = files.map((f) => f.filename);
    const panoramaNames = panoramaPro.panoramaNames;
    return this.propertiesClient
      .send('property.uploadMultiPanorama', {
        id,
        userId: payload.id,
        filenames,
        panoramaNames,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Get('all')
  @UseGuards(AuthGuard)
  getAllAccepted(
    @Query() query: FilterPropertyDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    query.status = PropertyStatus.ACCEPTED;
    return this.propertiesClient
      .send('property.getAllAccepted', { query, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('geo')
  @UseGuards(AuthGuard)
  getProByGeo(
    @Query() geoProDto: GeoProDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getProByGeo', { geoProDto, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('near')
  getProNearMe(@Query() nearProDto: NearProDto) {
    return this.propertiesClient
      .send('property.getProNearMe', { nearProDto })
      .pipe(retry(2), timeout(5000));
  }

  @Get('top/:limit')
  @UseInterceptors(CacheInterceptor)
  getTopScorePro(@Param('limit', ParseIntPipe) limit: number) {
    return this.propertiesClient
      .send('property.getTopScorePro', { limit })
      .pipe(retry(2), timeout(5000));
  }

  @Get(':proId')
  @UseGuards(AuthGuard)
  @Throttle({ default: { ttl: 10000, limit: 5 } })
  getOnePro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getOnePro', { proId, userId: user.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('images/:image')
  @SkipThrottle()
  @UseInterceptors(CacheInterceptor)
  showUploadedImage(@Param('image') imageName: string, @Res() res: Response) {
    // غير متاح في RPC، يبقى للتخدم مباشرة
    // return res.sendFile(imageName, { root: `images/properties` });
  }

  @Get('my')
  @UseGuards(AuthGuard)
  getOwnerPros(
    @CurrentUser() owner: JwtPayloadType,
    @Query() query: FilterPropertyDto,
  ) {
    return this.propertiesClient
      .send('property.getOwnerPros', { query, ownerId: owner.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('my')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  getAgencyPros(
    @Query() query: FilterPropertyDto,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getAgencyPros', { query, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('pending')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  getAllPendingAgency(
    @Query() query: FilterPropertyDto,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getAllPendingAgency', { query, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  getAll(
    @Query() query: FilterPropertyDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.getAll', { query, userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  @Get('pending')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  getAllPending(
    @Query() query: FilterPropertyDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    query.status = PropertyStatus.PENDING;
    return this.propertiesClient
      .send('property.getAllPending', { query, userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }

  // ===== دوال Patch المعلقة كانت مع التعليقات =====
  /* @Patch('acc/:proId')
  acceptProById(...) {...}

  @Patch('rej/:id')
  rejectProById(...) {...} */

  @Patch('my/:proId')
  @UseGuards(AuthGuard)
  updateOwnerPro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() owner: JwtPayloadType,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesClient
      .send('property.updateOwnerPro', {
        proId,
        ownerId: owner.id,
        dto: updatePropertyDto,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':proId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  updateAgencyPro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() agency: JwtPayloadType,
    @Body() editProAgencyDto: EditProAgencyDto,
  ) {
    return this.propertiesClient
      .send('property.updateAgencyPro', {
        proId,
        agencyId: agency.id,
        dto: editProAgencyDto,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Patch('acc/:proId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  acceptAgencyPro(
    @Param('proId', ParseIntPipe) proId: number,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.acceptAgencyPro', { proId, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch('rej/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  @UseInterceptors(AuditInterceptor)
  rejectAgencyPro(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() agency: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.rejectAgencyPro', { id, agencyId: agency.id })
      .pipe(retry(2), timeout(5000));
  }

  @Patch(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  updateAdminPro(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProAdminDto: UpdateProAdminDto,
  ) {
    return this.propertiesClient
      .send('property.updateAdminPro', { id, dto: updateProAdminDto })
      .pipe(retry(2), timeout(5000));
  }

  @Delete(':proId')
  @UseGuards(AuthGuard)
  deleteOwnerPro(
    @Param('proId', ParseIntPipe) proId: number,
    @Body() deleteUserDto: DeleteUserDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.deleteOwnerPro', {
        proId,
        userId: user.id,
        password: deleteUserDto.password,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Delete('remove-any-img/:id/:imageName')
  @UseGuards(AuthGuard)
  removeAnyImg(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageName') imageName: string,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.propertiesClient
      .send('property.removeAnyImg', { id, userId: payload.id, imageName })
      .pipe(retry(2), timeout(5000));
  }

  @Delete('delete')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseInterceptors(AuditInterceptor)
  deleteAdminPro(@Param('id') id: string) {
    return this.propertiesClient
      .send('property.deleteAdminPro', { id: +id })
      .pipe(retry(2), timeout(5000));
  }

  /*  @Delete('delete')
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.AGENCY)
    @UseInterceptors(AuditInterceptor)
    deleteAgencyPro(
      @Param('proId', ParseIntPipe) proId: number,
      @CurrentUser() agency: JwtPayloadType,
    ) {
      return this.propertiesService.deleteProById(proId);
    }*/
  /*  @Delete('remove-img/:proId')
    @UseGuards(AuthGuard)
    removeSingleImage(
      @Param('proId', ParseIntPipe) proId: number,
      @CurrentUser() user: JwtPayloadType,
    ) {
      return this.propertiesService.removeSingleImage(proId, user.id);
    }*/
}

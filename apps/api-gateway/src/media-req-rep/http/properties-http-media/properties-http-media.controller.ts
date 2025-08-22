import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { retry, timeout } from 'rxjs/operators';
import { PanoramaPro } from '@malaz/contracts/dtos/properties/properties/panorama-pro.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('properties-http-media')
export class PropertiesHttpMediaController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Get('images/:image')
  @SkipThrottle()
  @UseInterceptors(CacheInterceptor)
  showUploadedImage(@Param('image') imageName: string, @Res() res: Response) {
    // غير متاح في RPC، يبقى للتخدم مباشرة
    // return res.sendFile(imageName, { root: `images/properties` });
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
}

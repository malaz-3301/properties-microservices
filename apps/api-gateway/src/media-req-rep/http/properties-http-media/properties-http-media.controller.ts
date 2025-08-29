import {
  BadRequestException,
  Controller,
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
import { PanoramaPro } from '@malaz/contracts/dtos/properties/properties/panorama-pro.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, retry, timeout } from 'rxjs';
import { unlinkSync } from 'node:fs';
import { join } from 'node:path';
import * as process from 'node:process'; //انتبه انك تستوردهن من هون

@Controller('properties-media')
export class PropertiesHttpMediaController {
  constructor(
    @Inject('PROPERTIES_SERVICE')
    private readonly propertiesClient: ClientProxy,
  ) {}

  @Post('upload-img/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('property-image'))
  async uploadSingleImg(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const pro = await lastValueFrom(
      this.propertiesClient
        .send('properties.getUserPro', {
          proId: id,
          userId: payload.id,
          role: payload.userType,
        })
        .pipe(retry(2), timeout(5000)),
    );
    if (pro.propertyImage) {
      console.log('yesyes');
      try {
        unlinkSync(
          join(process.cwd(), `./images/properties/${pro.propertyImage}`),
        ); //file path
      } catch (err) {
        console.log(err);
      }
    }

    return this.propertiesClient
      .send('properties.uploadSingleImg', {
        proId: id,
        userId: payload.id,
        filename: file.filename,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upload-multiple-img/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('property-images', 8))
  async uploadMultiImg(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No file uploaded');
    const filenames = files.map((f) => f.filename);

    const pro = await lastValueFrom(
      this.propertiesClient
        .send('properties.getUserPro', {
          proId: id,
          userId: payload.id,
          role: payload.userType,
        })
        .pipe(retry(2), timeout(5000)),
    );
    //بقي الحذف لسا
    const length = pro.propertyImages?.length + filenames.length;
    if (length > 8) {
      console.log('delete');
      const sub = length - 8;
      const forDelete = pro.propertyImages.splice(0, sub); //حذف + عرفت الاسماء
      for (const photo of forDelete) {
        unlinkSync(join(process.cwd(), `./images/properties/${photo}`)); //file path
      }
    }
    const newFilenames = pro.propertyImages
      ? pro.propertyImages.concat(filenames)
      : filenames.concat(); //concat

    return this.propertiesClient
      .send('properties.uploadMultiImg', {
        proId: id,
        userId: payload.id,
        filenames: newFilenames,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upload-multiple-pan/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('property-images', 8))
  async uploadMultiPanorama(
    @Param('id', ParseIntPipe) id: number,
    @Query() panoramaPro: PanoramaPro,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No file uploaded');
    const filenames = files.map((f) => f.filename);
    const panoramaNames = panoramaPro.panoramaNames;

    const pro = await lastValueFrom(
      this.propertiesClient
        .send('properties.getUserPro', {
          proId: id,
          userId: payload.id,
          role: payload.userType,
        })
        .pipe(retry(2), timeout(5000)),
    );

    //مقارنة المفاتيح المتشابهة لحذف القيم لان المفاتيح ثابتة
    const panoramaNamesParse = (pro?.panoramaImages as any) || [];
    const forDelete: string[] = panoramaNames.reduce((acc: string[], name) => {
      if (panoramaNamesParse.hasOwnProperty(name)) {
        acc.push(panoramaNamesParse[name]);
      }
      return acc;
    }, []);

    for (const filename of forDelete) {
      unlinkSync(join(process.cwd(), `./images/properties/${filename}`));
    }

    return this.propertiesClient
      .send('properties.uploadMultiPanorama', {
        proId: id,
        userId: payload.id,
        panoramaNames: panoramaNames,
        filenames: filenames,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Get('images/:image')
  @SkipThrottle()
  @UseInterceptors(CacheInterceptor)
  public showUploadedImage(
    @Param('image') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(imageName, { root: `images/properties` });
  }

  /*
    @Delete('remove-any-img/:id/:imageName')
    @UseGuards(AuthGuard)
    async removeAnyImg(
      @Param('id', ParseIntPipe) id: number,
      @Param('imageName') imageName: string,
      @CurrentUser() payload: JwtPayloadType,
    ) {
      const pro = await lastValueFrom(
        this.propertiesClient
          .send('properties.getUserPro', {
            proId: id,
            userId: payload.id,
            role: payload.userType,
          })
          .pipe(retry(2), timeout(5000)),
      );
      if (!pro?.propertyImages.includes(imageName)) {
        throw new BadRequestException('User does not have image');
      }
      const imagePath = join(process.cwd(), `./images/properties/${imageName}`);
      unlinkSync(imagePath); //delete
      return this.propertiesClient
        .send('properties.removeAnyImg', {
          proId: id,
          userId: payload.id,
          imageName: imageName,
        })
        .pipe(retry(2), timeout(5000));
    }
  */
}

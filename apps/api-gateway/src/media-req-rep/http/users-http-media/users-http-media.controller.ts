import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { lastValueFrom, retry, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UsersHttpMediaService } from './users-http-media.service';
import { Response } from 'express';
import { unlinkSync } from 'node:fs';
import { join } from 'node:path';
import * as process from 'node:process';

@Controller('users-media')
export class UsersHttpMediaController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    private readonly usersHttpMediaService: UsersHttpMediaService,
  ) {}

  @Post('profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('user-image'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: payload.id })
        .pipe(retry(2), timeout(5000)),
    );
    if (user.profileImage) {
      this.usersHttpMediaService.removePhysicalImage(user.profileImage);
    }

    return this.usersClient
      .send('users.setProfileImage', {
        userId: payload.id,
        filename: file.filename,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upgrade/:commission/:lat/:lon')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('user-images', 2))
  //function
  async upgradeToAgency(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @CurrentUser() payload: JwtPayloadType,
    @Param('commission', ParseIntPipe) agencyCommissionRate: number,
    @Param('lat', ParseFloatPipe) lat: number,
    @Param('lon', ParseFloatPipe) lon: number,
  ) {
    //بدل dto
    if (agencyCommissionRate < 0 || agencyCommissionRate > 10) {
      throw new BadRequestException('Commission rate must be between 0 and 10');
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('No file uploaded');
    }

    //من الغرض بس الاسم
    const filenames: string[] = files.map((f) => f.filename);

    const agency = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: payload.id })
        .pipe(retry(2), timeout(5000)),
    );
    let agencyInfo = agency.agencyInfo;
    //بقي الحذف لسا
    if (agencyInfo) {
      const length = agencyInfo.docImages?.length + filenames.length;
      if (length > 2) {
        console.log('docImages');
        const sub = length - 2;
        const forDelete = agencyInfo.docImages.splice(0, sub); //حذف + عرفت الاسماء
        for (const photo of forDelete) {
          unlinkSync(join(process.cwd(), `./images/users/${photo}`)); //file path
        }
      }
    }

    return this.usersClient
      .send('users.upgradeToAgency', {
        userId: payload.id,
        filenames: filenames,
        agencyCommissionRate: agencyCommissionRate,
        lat: lat,
        lon: lon,
      })
      .pipe(retry(2), timeout(5000));
  }

  @Delete('remove-img')
  @UseGuards(AuthGuard)
  async removeProfileImage(@CurrentUser() payload: JwtPayloadType) {
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: payload.id })
        .pipe(retry(2), timeout(5000)),
    );
    //التحقق اولا من وجود المستخدم
    if (!user.profileImage) {
      throw new BadRequestException('User does not have image');
    }
    this.usersHttpMediaService.removePhysicalImage(user.profileImage);
    //current working directory

    this.usersClient.emit('users.removeProfileImage', { userId: payload.id });
  }

  @Get('images/:image')
  public showUploadedImage(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(image, { root: `images/users` });
  }
}

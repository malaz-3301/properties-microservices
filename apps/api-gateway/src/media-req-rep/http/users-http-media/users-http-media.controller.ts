import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
import { retry, timeout } from 'rxjs';
import { SkipThrottle } from '@nestjs/throttler';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users-http-media')
export class UsersHttpMediaController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
  ) {}

  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('user-image'))
  uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    const filename = file?.filename;
    return this.usersClient
      .send('users.uploadProfileImage', { userId: payload.id, filename })
      .pipe(retry(2), timeout(5000));
  }

  @Post('upgrade/:cR')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('user-images', 2))
  upgrade(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() payload: JwtPayloadType,
    @Param('cR', ParseIntPipe) agencyCommissionRate: number,
  ) {
    const filenames = files.map((f) => f.filename);
    return this.usersClient
      .send('users.upgrade', {
        userId: payload.id,
        filenames,
        agencyCommissionRate,
      })
      .pipe(retry(2), timeout(5000));
  } // يمكن ترك الصور للـ REST مباشرة أو تحويلهم اذا تريد
  @Get('images/:image')
  @SkipThrottle()
  public showUploadedImage(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    // تبقى REST لأن إرسال الملف مباشرة
  }

  @Delete('remove-img')
  @UseGuards(AuthGuard)
  removeProfileImage(@CurrentUser() payload: JwtPayloadType) {
    return this.usersClient
      .send('users.removeProfileImage', { userId: payload.id })
      .pipe(retry(2), timeout(5000));
  }
}

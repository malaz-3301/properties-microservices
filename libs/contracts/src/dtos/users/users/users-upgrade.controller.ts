import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { UsersService } from '../../../../../../apps/users-micro/src/users/users.service';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { UserType } from '@malaz/contracts/utils/enums';


@Controller('userU')
export class UsersUpgradeController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upgrade/:cR')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('user-images', 2))
  //function
  upgrade(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @CurrentUser() payload: JwtPayloadType,
    @Param('cR', ParseIntPipe) agencyCommissionRate: number,
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
    console.log('File uploaded ', { files });
    return this.usersService.upgrade(
      payload.id,
      filenames,
      agencyCommissionRate,
    );
  }

  @Get(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.AGENCY)
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }
}

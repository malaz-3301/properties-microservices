import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { Language, UserType } from '@malaz/contracts/utils/enums';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '@malaz/contracts/decorators/current-user.decorator';
import { AuthGuard } from '@malaz/contracts/guards/auth.guard';
import { Roles } from '@malaz/contracts/decorators/user-role.decorator';
import { AuthRolesGuard } from '@malaz/contracts/guards/auth-roles.guard';
import { AddAdminDto } from '@malaz/contracts/dtos/auth/add-admin.dto';
import { LoginUserDto } from '@malaz/contracts/dtos/auth/login-user.dto';
import { ResetAccountDto } from '@malaz/contracts/dtos/auth/reset-account.dto';
import { ResetPasswordDto } from '@malaz/contracts/dtos/auth/reset-password.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, retry, timeout } from 'rxjs';

@Controller('auth')
export class ToAuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {} // أي اسم client

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authClient.send('auth.login', loginUserDto).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Post('reset')
  resetAccount(@Body() resetAccountDto: ResetAccountDto) {
    return this.authClient.send('auth.resetAccount', resetAccountDto).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Post('reset_pass')
  @UseGuards(AuthGuard)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.authClient
      .send('auth.resetPassword', { userId: payload.id, resetPasswordDto })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }

  @Get('tokenTime')
  @UseGuards(AuthGuard)
  tokenTime(@CurrentUser() payload: JwtPayloadType) {
    return this.authClient.send('auth.tokenTime', { userId: payload.id }).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Post('addAdmin')
  @Roles(UserType.SUPER_ADMIN)
  @UseGuards(AuthRolesGuard)
  addAdmin(@Body() addAdminDto: AddAdminDto) {
    return this.authClient.send('auth.addAdmin', addAdminDto).pipe(
      retry(2),
      timeout(5000),
      catchError((err) => {
        throw err;
      }),
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Throttle({ default: { ttl: 10000, limit: 8 } })
  getCurrentUser(@CurrentUser() payload: JwtPayloadType) {
    return this.authClient
      .send('auth.getCurrentUser', { userId: payload.id })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }

  @Get('changeLanguage/:language')
  @UseGuards(AuthGuard)
  @Throttle({ default: { ttl: 10000, limit: 8 } })
  changeLanguage(
    @CurrentUser() payload: JwtPayloadType,
    @Param('language') language: Language,
  ) {
    return this.authClient
      .send('auth.changeLanguage', { userId: payload.id, language })
      .pipe(
        retry(2),
        timeout(5000),
        catchError((err) => {
          throw err;
        }),
      );
  }
}

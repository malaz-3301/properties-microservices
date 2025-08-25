import { Controller } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto } from '@malaz/contracts/dtos/auth/login-user.dto';
import { ResetAccountDto } from '@malaz/contracts/dtos/auth/reset-account.dto';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { ResetPasswordDto } from '@malaz/contracts/dtos/auth/reset-password.dto';
import { AddAdminDto } from '@malaz/contracts/dtos/auth/add-admin.dto';
import { Language } from '@malaz/contracts/utils/enums';
import { AuthMicroService } from './auth-micro.service';

@Controller('auth')
export class AuthMicroController {
  constructor(private readonly authService: AuthMicroService) {}

  @MessagePattern('auth.login')
  login(@Payload() loginUserDto: LoginUserDto) {
    console.log('rpc');
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('auth.resetAccount')
  resetAccount(@Payload() resetAccountDto: ResetAccountDto) {
    return this.authService.resetAccount(resetAccountDto);
  }

  @MessagePattern('auth.resetPassword')
  resetPassword(
    @Payload() data: { userId: number; resetPasswordDto: ResetPasswordDto },
  ) {
    return this.authService.resetPassword(data.userId, data.resetPasswordDto);
  }

  @MessagePattern('auth.tokenTime')
  tokenTime(@Payload() data: { userId: number }) {
    return this.authService.tokenTime(data.userId);
  }

  @MessagePattern('auth.addAdmin')
  addAdmin(@Payload() addAdminDto: AddAdminDto) {
    return this.authService.addAdmin(addAdminDto);
  }

  @MessagePattern('auth.getCurrentUser')
  getCurrentUser(@Payload() payload: { userId: number }) {
    return this.authService.getCurrentUser(payload.userId);
  }

  @MessagePattern('auth.changeLanguage')
  changeLanguage(@Payload() data: { userId: number; language: Language }) {
    return this.authService.changeLanguage(data.language, data.userId);
  }
}

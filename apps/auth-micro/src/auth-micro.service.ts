import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';

import { LessThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto } from '@malaz/contracts/dtos/auth/login-user.dto';
import { ResetAccountDto } from '@malaz/contracts/dtos/auth/reset-account.dto';
import { ResetPasswordDto } from '@malaz/contracts/dtos/auth/reset-password.dto';
import { AddAdminDto } from '@malaz/contracts/dtos/auth/add-admin.dto';
import { Language } from '@malaz/contracts/utils/enums';
import { User } from '../../users-micro/src/users/entities/user.entity';
import { UsersOtpProvider } from '../../users-micro/src/users/providers/users-otp.provider';
import { UsersGetProvider } from '../../users-micro/src/users/providers/users-get.provider';
import { BannedService } from '../../users-micro/src/banned/banned.service';

@Injectable()
export class AuthMicroService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersOtpProvider: UsersOtpProvider,
    private readonly usersGetProvider: UsersGetProvider,
    private readonly bannedService: BannedService,
  ) {}

  /**
   *
   * @param loginUserDto
   */
  async login(loginUserDto: LoginUserDto) {
    const { phone, username, password } = loginUserDto;
    const user = phone //if بطريقة عمك ملاز
      ? await this.usersRepository.findOneBy({ phone: phone })
      : await this.usersRepository.findOneBy({ username: username });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    await this.bannedService.checkBlock(user?.id);
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      throw new UnauthorizedException('Password is incorrect');
    }
    if (!user.isAccountVerified) {
      throw new UnauthorizedException('Your account has not been verified');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      userType: user.userType,
    });

    return {
      accessToken,
      UserType: user.userType,
    };
  }

  async resetAccount(resetAccountDto: ResetAccountDto) {
    const { phone, username } = resetAccountDto;
    const user = phone //if بطريقة عمك ملاز
      ? await this.usersRepository.findOneBy({ phone: phone })
      : await this.usersRepository.findOneBy({ username: username });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return await this.usersOtpProvider.otpCreate(user.id); //لأنك حذفت السطر ممكن و ارسال

    //otpVerify
  }

  async resetPassword(userId: number, resetPasswordDto: ResetPasswordDto) {
    // طبعا بعد التحقق من الرمز
    const user = await this.usersGetProvider.findByIdOtp(userId);
    user.password = await this.usersOtpProvider.hashCode(
      resetPasswordDto.password,
    );

    if (user.otpEntity.passChangeAccess) {
      //اخر update تمت لما تم التحقق من الرمز (يعني هي فترة بين التحقق و ادخال الجديدة)
      const createdAtTimestamp = user.otpEntity.createdAt.getTime();
      const expireInSec = (Date.now() - createdAtTimestamp) / 1000;
      if (expireInSec > 120) {
        throw new UnauthorizedException({
          message: 'Your action has expired 60 s retry',
        });
      }
      user.otpEntity.passChangeAccess = false; //سكرها
      await this.usersRepository.save(user); // عامل cascade لأن
      console.log('password reset');
    } else {
      throw new UnauthorizedException({
        message: 'You did not verify code to reset password',
      });
    }
  }

  tokenTime(payload) {
    const TimeBySeconds = payload.exp - Math.floor(Date.now() / 1000); // التحويل لثانية
    const hours = Math.floor(TimeBySeconds / 3600);
    const minutes = Math.floor((TimeBySeconds % 3600) / 60);
    //ملاحظة ملحوظية يتم حساب الوقت من 1970 (:
    return {
      Expires_in: ` < ${hours}h : ${minutes}m  > `,
    };
  }

  async getCurrentUser(myId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: myId },
      relations: { plan: true },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async addAdmin(addAdminDto: AddAdminDto) {
    addAdminDto['isAccountVerified'] = true;
    await this.usersRepository.save(addAdminDto);
  }

  async changeLanguage(Language: Language, userId: number) {
    await this.usersRepository.update({ id: userId }, { language: Language });
  }
}

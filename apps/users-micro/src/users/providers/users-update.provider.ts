import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { UsersGetProvider } from './users-get.provider';
import { UsersOtpProvider } from './users-otp.provider';
import { UserType } from '@malaz/contracts/utils/enums';
import { UpdateUserDto } from '@malaz/contracts/dtos/users/users/update-user.dto';

@Injectable()
export class UsersUpdateProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersGetProvider: UsersGetProvider,
    private readonly usersOtpProvider: UsersOtpProvider,
  ) {}

  async updateMe(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersGetProvider.findById(id);
    const { myPassword, ...updateDto } = updateUserDto;
    //test my password
    const isPass = await bcrypt.compare(myPassword, user.password);
    if (!isPass) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const { password } = updateDto;
    if (password) {
      updateDto.password = await this.usersOtpProvider.hashCode(password);
    }

    await this.usersRepository.update(id, updateDto);
    return this.usersGetProvider.findById(id);
  }

  async updateUserById(id: number, update: any) {
    const user = await this.usersGetProvider.findById(id);
    if (user.userType !== UserType.Owner) {
      throw new UnauthorizedException("You Can't Update Admin");
    }
    await this.usersRepository.update(id, update);
    return this.usersGetProvider.findById(id);
  }

  async upgradeUser(userId: number) {
    const user = await this.usersGetProvider.findById(userId);
    return this.usersRepository.update(userId, {
      userType: UserType.ADMIN,
    });
  }
}

import { Controller } from '@nestjs/common';
import { UsersService } from '../users.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUserDto } from '@malaz/contracts/dtos/users/users/register-user.dto';
import { UpdateUserDto } from '@malaz/contracts/dtos/users/users/update-user.dto';
import { FilterUserDto } from '@malaz/contracts/dtos/users/users/filter-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.register')
  async register(@Payload() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @MessagePattern('users.register_back')
  async register_back_users() {
    console.log('register_back_users');
    return this.usersService.register_back_users();
  }

  @MessagePattern('users.otpVerify')
  otpVerify(@Payload() data: { code: string; id: number }) {
    return this.usersService.otpVerify(data.code, data.id);
  }

  @MessagePattern('users.otpReSend')
  otpReSend(@Payload() payload: { id: number }) {
    return this.usersService.otpReSend(payload.id);
  }

  @MessagePattern('users.otpTimer')
  otpTimer(@Payload() payload: { id: number }) {
    return this.usersService.otpTimer(payload.id);
  }

  @MessagePattern('users.updateMe')
  updateMe(@Payload() data: { userId: number; updateUserDto: UpdateUserDto }) {
    return this.usersService.updateMe(data.userId, data.updateUserDto);
  }

  @MessagePattern('users.deleteMe')
  deleteMe(@Payload() data: { userId: number; password: string }) {
    return this.usersService.deleteMe(data.userId, data.password);
  }

  @MessagePattern('users.setProfileImage')
  uploadProfileImage(@Payload() data: { userId: number; filename: string }) {
    return this.usersService.setProfileImage(data.userId, data.filename);
  }

  @EventPattern('users.removeProfileImage')
  removeProfileImage(@Payload() Payload: { userId: number }) {
    return this.usersService.removeProfileImage(Payload.userId);
  }

  @MessagePattern('users.set_plan')
  setUserPlan(@Payload() data: { userId: number; planId: number }) {
    return this.usersService.setUserPlan(data.userId, data.planId);
  }

  @MessagePattern('users.getAllAgency')
  getAllAgency(@Payload() query: FilterUserDto) {
    return this.usersService.getAllAgency(query);
  }

  @MessagePattern('users.getOneAgency')
  getOneAgency(@Payload() payload: { agencyId: number }) {
    return this.usersService.getOneAgency(payload.agencyId);
  }

  @MessagePattern('users.getUserProsById')
  getUserProsById(@Payload() payload: { userId: number }) {
    return this.usersService.getUserProsById(payload.userId);
  }
}

import { Controller } from '@nestjs/common';
import { UsersService } from '../users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern('users.verify_otp')
  otpVerify(@Payload() data: { code: string; id: number }) {
    return this.usersService.otpVerify(data.code, data.id);
  }

  @MessagePattern('users.resend_otp')
  otpReSend(@Payload() id: number) {
    return this.usersService.otpReSend(id);
  }

  @MessagePattern('users.otp_timer')
  otpTimer(@Payload() id: number) {
    return this.usersService.otpTimer(id);
  }

  @MessagePattern('users.update_me')
  updateMe(@Payload() data: { userId: number; dto: UpdateUserDto }) {
    return this.usersService.updateMe(data.userId, data.dto);
  }

  @MessagePattern('users.delete_me')
  deleteMe(@Payload() data: { userId: number; password: string }) {
    return this.usersService.deleteMe(data.userId, data.password);
  }

  @MessagePattern('users.set_profile_image')
  uploadProfileImage(@Payload() data: { userId: number; filename: string }) {
    return this.usersService.setProfileImage(data.userId, data.filename);
  }

  @MessagePattern('users.remove_profile_image')
  removeProfileImage(@Payload() userId: number) {
    return this.usersService.removeProfileImage(userId);
  }

  @MessagePattern('users.set_plan')
  setUserPlan(@Payload() data: { userId: number; planId: number }) {
    return this.usersService.setUserPlan(data.userId, data.planId);
  }

  @MessagePattern('users.get_all_agency')
  getAllAgency(@Payload() query: FilterUserDto) {
    return this.usersService.getAllAgency(query);
  }

  @MessagePattern('users.get_one_agency')
  getOneAgency(@Payload() agencyId: number) {
    return this.usersService.getOneAgency(agencyId);
  }

  @MessagePattern('users.get_user_pros')
  getUserProsById(@Payload() userId: number) {
    return this.usersService.getUserProsById(userId);
  }
}

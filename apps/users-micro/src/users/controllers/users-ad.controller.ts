import { Controller } from '@nestjs/common';
import { UsersService } from '../users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilterUserDto } from '@malaz/contracts/dtos/users/users/filter-user.dto';
import { UpdateUserByAdminDto } from '@malaz/contracts/dtos/users/users/update-user-by-admin.dto';

@Controller('users-ad')
export class UsersAdController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.getAllUsers')
  getAllAUsers(@Payload() query: FilterUserDto) {
    return this.usersService.getAllUsers(query);
  }

  @MessagePattern('users.getAllPending')
  getAllPending(@Payload() query: FilterUserDto) {
    return this.usersService.getAllPending(query);
  }

  @MessagePattern('userA.get_all_admins')
  getAllAdmins(@Payload() query: FilterUserDto) {
    return this.usersService.getAllAdmins(query);
  }

  @MessagePattern('userA.get_user_by_id')
  getUserById(@Payload() id: number) {
    return this.usersService.getUserById(id);
  }

  @MessagePattern('userA.upgrade_user')
  upgradeUser(@Payload() userId: number) {
    return this.usersService.upgradeUser(userId);
  }

  @MessagePattern('userA.update_user_by_id')
  updateUserById(@Payload() data: { id: number; dto: UpdateUserByAdminDto }) {
    return this.usersService.updateUserById(data.id, data.dto);
  }

  @MessagePattern('userA.get_admin_by_id')
  getAdminById(@Payload() adminId: number) {
    return this.usersService.getAdminById(adminId);
  }

  @MessagePattern('userA.delete_user_by_id')
  deleteById(@Payload() data: { id: number; message: string }) {
    return this.usersService.deleteUserById(data.id, data.message);
  }
}

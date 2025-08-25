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

  @MessagePattern('users.getAllAdmins')
  getAllAdmins(@Payload() query: FilterUserDto) {
    return this.usersService.getAllAdmins(query);
  }

  @MessagePattern('users.upgradeUser')
  upgradeUser(@Payload() payload: { userId: number }) {
    return this.usersService.upgradeUser(payload.userId);
  }

  @MessagePattern('users.updateUserById')
  updateUserById(
    @Payload()
    data: {
      userId: number;
      updateUserByAdminDto: UpdateUserByAdminDto;
    },
  ) {
    return this.usersService.updateUserById(
      data.userId,
      data.updateUserByAdminDto,
    );
  }

  @MessagePattern('userA.get_admin_by_id')
  getAdminById(@Payload() adminId: number) {
    return this.usersService.getAdminById(adminId);
  }

  @MessagePattern('users.deleteById')
  deleteById(@Payload() data: { userId: number; message: string }) {
    return this.usersService.deleteUserById(data.userId, data.message);
  }
}

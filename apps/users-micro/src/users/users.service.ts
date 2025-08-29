import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersOtpProvider } from './providers/users-otp.provider';
import { UsersUpdateProvider } from './providers/users-update.provider';
import { UsersDelProvider } from './providers/users-del.provider';
import { UsersGetProvider } from './providers/users-get.provider';
import { UsersImgProvider } from './providers/users-img.provider';

import { UsersRegisterProvider } from './providers/users-register-provider';
import { UserType } from '@malaz/contracts/utils/enums';
import { RegisterUserDto } from '@malaz/contracts/dtos/users/users/register-user.dto';
import { UpdateUserDto } from '@malaz/contracts/dtos/users/users/update-user.dto';
import { UpdateUserByAdminDto } from '@malaz/contracts/dtos/users/users/update-user-by-admin.dto';
import { FilterUserDto } from '@malaz/contracts/dtos/users/users/filter-user.dto';
import { GeoProDto } from '@malaz/contracts/dtos/properties/properties/geo-pro.dto';
import { NearProDto } from '@malaz/contracts/dtos/properties/properties/near-pro.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersRegisterProvider: UsersRegisterProvider,
    private readonly usersOtpProvider: UsersOtpProvider,
    private readonly usersUpdateProvider: UsersUpdateProvider,
    private readonly usersImgProvider: UsersImgProvider,
    private readonly usersGetProvider: UsersGetProvider,
    private readonly usersDelProvider: UsersDelProvider,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    return this.usersRegisterProvider.register(registerUserDto);
  }

  async register_back_users() {
    return this.usersRegisterProvider.register_back_users();
  }

  async otpVerify(code: string, id: number) {
    return this.usersOtpProvider.otpVerify(code, id);
  }

  async otpTimer(id: number) {
    return this.usersOtpProvider.otpTimer(id);
  }

  async otpReSend(id: number) {
    return this.usersOtpProvider.otpReSend(id);
  }

  getAll() {
    return this.usersRepository.find();
  }

  //مشترك
  async updateMe(id: number, updateUserDto: UpdateUserDto) {
    return this.usersUpdateProvider.updateMe(id, updateUserDto);
  }

  async updateUserById(id: number, updateUserByAdminDto: UpdateUserByAdminDto) {
    return this.usersUpdateProvider.updateUserById(id, updateUserByAdminDto);
  }

  async upgradeUser(userId) {
    return this.usersUpdateProvider.upgradeUser(userId);
  }

  public async getUserById(id: number) {
    return this.usersGetProvider.findById(id);
  }

  async getUserProsById(id: number) {
    return this.usersGetProvider.getUserProsById(id);
  }

  async getUserByGeo(geoProDto: GeoProDto, userId: number) {
    return this.usersGetProvider.getUserByGeo(geoProDto, userId);
  }

  async getUserNearMe(nearProDto: NearProDto, userId: number) {
    return this.usersGetProvider.getUserNearMe(nearProDto, userId);
  }

  async getAllAgency(query: FilterUserDto) {
    query.role = UserType.AGENCY;
    return this.usersGetProvider.getAll(query);
  }

  async getOneAgency(agencyId: number) {
    return this.usersGetProvider.getOneAgency(agencyId);
  }

  async getOneAgencyInfo(agencyId: number) {
    return this.usersGetProvider.getOneAgencyInfo(agencyId);
  }

  async getAdminById(adminId: number) {
    return this.usersGetProvider.getAdminById(adminId);
  }

  async getAllUsers(query: FilterUserDto) {
    return this.usersGetProvider.getAll(query);
  }

  async getAllPending(query: FilterUserDto) {
    query.role = UserType.PENDING;
    return this.usersGetProvider.getAll(query);
  }

  async getAllAdmins(query: FilterUserDto) {
    query.role = UserType.ADMIN;
    return this.usersGetProvider.getAll(query);
  }

  async deleteMe(id: number, password: string) {
    return this.usersDelProvider.deleteMe(id, password);
  }

  async deleteUserById(id: number, message: string) {
    return this.usersDelProvider.deleteUserById(id, message);
  }

  async setProfileImage(id: number, profileImage: string) {
    return this.usersImgProvider.setProfileImage(id, profileImage);
  }

  async removeProfileImage(id: number) {
    return this.usersImgProvider.removeProfileImage(id);
  }

  async upgradeToAgency(
    userId: number,
    filenames: string[],
    agencyCommissionRate: number,
    lat: number,
    lon: number,
  ) {
    return this.usersImgProvider.upgradeToAgency(
      userId,
      filenames,
      agencyCommissionRate,
      lat,
      lon,
    );
  }

  async setUserPlan(userId: number, planId: number) {
    return await this.usersRepository.update(userId, {
      plan: { id: planId },
      ...(planId === 2 ? { hasUsedTrial: true } : {}),
    });
  }
}

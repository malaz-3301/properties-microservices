import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UsersGetProvider } from './users-get.provider';
import { AgencyInfo } from '../entities/agency-info.entity';
import { UserType } from '@malaz/contracts/utils/enums';

@Injectable()
export class UsersImgProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(AgencyInfo)
    private readonly agencyInfoRepository: Repository<AgencyInfo>,
    private readonly usersGetProvider: UsersGetProvider,
  ) {}

  async setProfileImage(userId: number, profileImage: string) {
    const user = await this.usersGetProvider.findById(userId);
    user.profileImage = profileImage;
    await this.usersRepository.save(user);
    return { message: 'File uploaded successfully' };
  }

  async removeProfileImage(userId: number) {
    const user = await this.usersGetProvider.findById(userId);
    console.log('removeProfileImage');
    user.profileImage = null;
    await this.usersRepository.save(user);
    return 'Deleted profile image';
  }

  async upgradeToAgency(
    userId: number,
    filenames: string[],
    agencyCommissionRate: number,
    lat: number,
    lon: number,
  ) {
    const agency = await this.usersGetProvider.findById(userId);
    let agencyInfo = await this.agencyInfoRepository.findOneBy({
      user_id: userId,
    });
    if (!agencyInfo) {
      agencyInfo = this.agencyInfoRepository.create();
    }

    await this.usersRepository.save({
      ...agency,
      userType: UserType.PENDING,
      agencyInfo: {
        docImages: filenames,
        agencyCommissionRate: agencyCommissionRate,
      },
      location: {
        lat: lat,
        lon: lon,
      },
    });

    return {
      message: `File uploaded successfully :  ${filenames}`,
    };
  }
}

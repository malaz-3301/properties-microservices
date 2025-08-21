import {
  Controller,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { Payload } from '@nestjs/microservices';
import { JwtPayloadType } from '@malaz/contracts/utils/constants';
import { MessagePattern } from '@nestjs/microservices';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  // تغيير حالة التصويت لمادة معينة
  @MessagePattern('votes.changeStatus')
  async create(
    @Payload() payload: { proId: number, value: number, user: JwtPayloadType },
  ) {
    return this.votesService.changeVoteStatus(payload.proId, payload.value, payload.user.id);
  }

  // جلب المستخدمين الذين صوتوا لصعود المادة
  @MessagePattern('votes.whoVoted')
  async getUsersVotedUp(
    @Payload() payload: { proId: number },
  ) {
    return this.votesService.getUsersVotedUp(payload.proId);
  }

  // جلب المزعجين (spammers)
  @MessagePattern('votes.spammers')
  async getVoteSpammers() {
    return this.votesService.getVoteSpammers();
  }

}

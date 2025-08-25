import { Controller } from '@nestjs/common';
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
    @Payload() payload: { proId: number; value: number; userId: number },
  ) {
    return this.votesService.changeVoteStatus(
      payload.proId,
      payload.value,
      payload.userId,
    );
  }

  // جلب المستخدمين الذين صوتوا لصعود المادة
  @MessagePattern('votes.getUsersVotedUp')
  async getUsersVotedUp(@Payload() payload: { proId: number }) {
    return this.votesService.getUsersVotedUp(payload.proId);
  }

  // جلب المزعجين (spammers)
  @MessagePattern('votes.getSpammers')
  async getVoteSpammers() {
    return this.votesService.getVoteSpammers();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Honeypot } from './entities/honeypot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HoneypotService {
  constructor(
    @InjectRepository(Honeypot)
    private honeypotRepository: Repository<Honeypot>,
  ) {}

  async getHoneyPots() {
    return await this.honeypotRepository.find();
  }
}

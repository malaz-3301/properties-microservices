import { Module } from '@nestjs/common';
import { HoneypotService } from './honeypot.service';
import { HoneypotController } from './honeypot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Honeypot } from './entities/honeypot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Honeypot])],
  controllers: [HoneypotController],
  providers: [HoneypotService],
})
export class HoneypotModule {}

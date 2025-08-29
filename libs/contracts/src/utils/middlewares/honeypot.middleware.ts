import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Honeypot } from '../../../../../apps/api-gateway/src/honeypot/entities/honeypot.entity';
import { HoneyPotPaths } from '@malaz/contracts/utils/enums';

@Injectable()
export class HoneypotMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Honeypot)
    private honeypotRepository: Repository<Honeypot>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.path.toLowerCase();
    if (!HoneyPotPaths.includes(path)) return next();

    const xff = req.headers['x-forwarded-for'] as string | undefined;
    const ip = Array.isArray(xff)
      ? xff[0]
      : xff
        ? xff.split(',')[0].trim()
        : req.ip;
    // فحص إذا هذا الـ IP موجود مسبقاً
    const existing = await this.honeypotRepository.findOne({ where: { ip } });
    if (existing) {
      return res.status(403).send('Access denied');
    }
    // سجّل الـ IP مرة واحدة
    const hit = this.honeypotRepository.create({
      ip,
      x_forwarded_for: xff,
      user_agent: req.headers['user-agent'] || 'null',
      path,
      method: req.method,
      headers: req.headers,
    });

    await this.honeypotRepository.save(hit);

    return res.status(403).send('Access denied');
  }
}

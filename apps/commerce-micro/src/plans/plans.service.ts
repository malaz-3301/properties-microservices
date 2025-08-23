import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { CreatePlanDto } from '@malaz/contracts/dtos/commerce/plans/create-plan.dto';
import { Language, PlanType } from '@malaz/contracts/utils/enums';
import { UpdatePlanDto } from '@malaz/contracts/dtos/commerce/plans/update-plan.dto';
import { UsersGetProvider } from '../../../users-micro/src/users/providers/users-get.provider';
import { lastValueFrom, retry, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    private readonly usersGetProvider: UsersGetProvider, // محمد شيل هي
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    private dataSource: DataSource,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    const plan = this.planRepository.create(createPlanDto);
    await this.createAndUpdatePlan(plan, createPlanDto);
    return this.planRepository.save(plan);
  }

  async create_back_planes() {
    await this.dataSource.query(`
    TRUNCATE TABLE "plans" RESTART IDENTITY CASCADE;
  `);
    const plans = [
      {
        planDuration: 'Other',
        multi_description: { ar: 'مجانية', en: 'Free', de: 'frei' },
        planType: PlanType.BASIC,
        limit: 0,
        planPrice: 0,
      },
      {
        planDuration: '1_day',
        multi_description: { ar: 'تجربة', en: 'Trial', de: 'Versuch' },
        planType: PlanType.TRIAL,
        limit: 1,
        planPrice: 0,
      },
      {
        planDuration: '3_month',
        ar_description:
          'تتيح الخطة البلاتينية للمشتركين نشر ثلاثين عقار و تمتد ثلاث شهور 💎',
        en_description:
          'Platinum plan allows users to post thirty properties and extends for three months 💎',
        multi_description: {
          ar: 'تتيح الخطة البلاتينية للمشتركين نشر ثلاثين عقار و تمتد ثلاث شهور 💎',
          en: 'Platinum plan allows users to post thirty properties and extends for three months 💎',
          de: 'Der Platinum-Plan ermöglicht es den Nutzern, dreißig Immobilien zu posten und gilt für drei Monate 💎',
        },
        planType: PlanType.Platinum,
        limit: 30,
        planPrice: 9,
      },
      {
        planDuration: '10_month',
        multi_description: {
          ar: 'تقدم لك خطة Vip نشر ثمانين عقار و تمتد لعشر شهور 🏅',
          en: 'Vip plan offers you eighty properties for ten months. 🏅',
          de: 'Der VIP-Plan bietet Ihnen achtzig Immobilien für zehn Monate. 🏅',
        },
        planType: PlanType.VIP,
        limit: 0,
        planPrice: 19,
      },
    ];
    const entities = this.planRepository.create(plans);
    return this.planRepository.save(entities);
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const plan = await this.planRepository.findOneBy({ id: id });
    if (!plan) {
      throw new NotFoundException();
    }
    await this.createAndUpdatePlan(plan, updatePlanDto);
    return this.planRepository.save({ ...plan, ...updatePlanDto });
  }

  async findAll(userId: number) {
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: userId })
        .pipe(retry(2), timeout(5000)),
    );

    //ارجاع الخطة اذا منتهية
    const count = await lastValueFrom(
      this.usersClient
        .send('properties.getProsCount', { userId })
        .pipe(retry(2), timeout(5000)),
    );
    //اذا لسا ما تجاوز الحد لا تعرض خطته
    const planId = count < user.plan?.limit! ? user.plan?.id : 0;
    //شفلي اذا مستخدم الtrial من قبل رجعلي الخطط يلي مو trial
    let where;
    if (user.hasUsedTrial) {
      where = { id: Not(In([1, 2, planId])) };
    } else {
      //شيل بس الـ Free
      where = { id: Not(In([1, planId])) };
    }
    const plans = await this.planRepository.find({
      where: where,
    });
    for (let i = 0; i < plans.length; i++) {
      this.getTranslatedPlan(plans[i], user.language);
    }
    return plans;
  }

  getTranslatedPlan(plan: Plan, language: Language) {
    if (language == Language.ARABIC) {
      plan['description'] = plan.multi_description['ar'];
    } else if (language == Language.ENGLISH) {
      plan['description'] = plan.multi_description['en'];
    } else {
      plan['description'] = plan.multi_description['de'];
    }
  }

  async createAndUpdatePlan(
    plan: Plan,
    createPlanDto: CreatePlanDto | UpdatePlanDto,
  ) {
    if (createPlanDto.description) {
      plan.multi_description = { ar: createPlanDto.description };
      plan.multi_description['en'] = await this.usersGetProvider.translate(
        Language.ENGLISH,
        createPlanDto.description,
      );
      plan.multi_description['de'] = await this.usersGetProvider.translate(
        Language.Germany,
        createPlanDto.description,
      );
    }
  }
}

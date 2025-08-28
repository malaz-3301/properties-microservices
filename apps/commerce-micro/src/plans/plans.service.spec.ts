import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, Not, In } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { Property } from '../../../properties-micro/src/properties/entities/property.entity';
import { UsersGetProvider } from '../../../users-micro/src/users/providers/users-get.provider';
import { Language, PlanDuration, PlanType } from '@malaz/contracts/utils/enums';
import { CreatePlanDto } from '@malaz/contracts/dtos/commerce/plans/create-plan.dto';
import { UpdatePlanDto } from '@malaz/contracts/dtos/commerce/plans/update-plan.dto';
import { of } from 'rxjs';
describe('PlansService', () => {
  let service: PlansService;
  let planRepository: Repository<Plan>;
  let propertyRepository: Repository<Property>;
  let usersClient = { send: jest.fn() };
  let translateClient = { send: jest.fn() };
  let propertiesClient = { send: jest.fn() };
  let dataSource: DataSource;
  const PLAN_REPOSITORY_TOKEN = getRepositoryToken(Plan);
  const PROPERTY_REPOSITORY_TOKEN = getRepositoryToken(Property);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: PLAN_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: PROPERTY_REPOSITORY_TOKEN,
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: 'USERS_SERVICE',
          useValue: usersClient,
        },
        {
          provide: 'PROPERTIES_SERVICE',
          useValue: propertiesClient,
        },
        {
          provide: 'TRANSLATE_SERVICE',
          useValue: translateClient,
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<PlansService>(PlansService);
    planRepository = module.get<Repository<Plan>>(PLAN_REPOSITORY_TOKEN);
    propertyRepository = module.get<Repository<Property>>(
      PROPERTY_REPOSITORY_TOKEN,
    );
    dataSource = module.get<DataSource>(DataSource);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create test', async () => {
    const createPlanDto = {
      description: 'خطة',
      limit: 6,
      planDuration: PlanDuration.SIX_MONTHS,
      planPrice: 123,
      planType: PlanType.VIP,
    } as CreatePlanDto;
    const { description, ...plan } = createPlanDto;
    const en = 'plan';
    const de = 'plna';
    const savedPlan = {
      multi_description: { ar: description, en: en, de: de },
      ...plan,
    };
    jest.spyOn(planRepository, 'create').mockReturnValueOnce(plan as any);
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(savedPlan));
    jest.spyOn(planRepository, 'save').mockReturnValueOnce(savedPlan as any);
    await expect(service.create(createPlanDto)).resolves.toEqual(savedPlan);
    expect(planRepository.create).toHaveBeenCalledWith(createPlanDto);
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.createAndUpdatePlan',
      {
        plan: plan,
        planDto: createPlanDto,
      },
    );
    expect(planRepository.save).toHaveBeenCalledWith(savedPlan);
  });
  it('update test with exists plan', async () => {
    const updatePlanDto = {
      description: 'خطة',
      limit: 6,
      planDuration: PlanDuration.SIX_MONTHS,
      planPrice: 123,
      planType: PlanType.VIP,
    } as UpdatePlanDto;
    // const random = new Array(Math.floor(Math.random() * 100));
    // for (let i = 0; i < random.length; i++) {
    //   random[i] = Math.floor(Math.random() * 6);
    // }
    // console.log(random);
    const { description, ...plan } = updatePlanDto;
    const en = 'plan';
    const de = 'plna';
    const savedPlan = {
      multi_description: { ar: description, en: en, de: de },
      ...plan,
    };
    const planId = 1;
    jest
      .spyOn(planRepository, 'findOneBy')
      .mockResolvedValueOnce({ id: planId, ...updatePlanDto } as any);
    jest.spyOn(translateClient, 'send').mockReturnValueOnce(of(savedPlan));
    jest
      .spyOn(planRepository, 'save')
      .mockReturnValueOnce({ id: planId, ...savedPlan } as any);
    await expect(service.update(planId, updatePlanDto)).resolves.toEqual({
      id: planId,
      ...savedPlan,
    });
    expect(planRepository.findOneBy).toHaveBeenCalledWith({ id: planId });
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.createAndUpdatePlan',
      {
        plan: plan,
        planDto: updatePlanDto,
      },
    );
    expect(planRepository.save).toHaveBeenCalledWith({
      description: description,
      ...savedPlan,
    });
  });
  it('findAll test unlimited property', async () => {
    const userId = 1;
    const plans = [
      {
        multi_description: {
          ar: 'وصف',
          en: 'description',
          de: 'scriptionde',
        },
      },
    ];
    const user = {
      plan: { id: 1, limit: 6 },
      hasUsedTrial: true,
      language: Language.ARABIC,
    };
    const count = 3;
    const translatedPlans = plans.map(function (plan) {
      return { description: plan.multi_description[user.language], ...plan };
    });
    const findProperty = { where: { agency: { id: userId } } };
    const findPlan = { where: { id: Not(In([1, 2, 1])) } };
    jest.spyOn(usersClient, 'send').mockReturnValueOnce(of(user));
    jest.spyOn(planRepository, 'find').mockResolvedValueOnce(plans as any);
    jest
      .spyOn(translateClient, 'send')
      .mockReturnValueOnce(of(translatedPlans));
    jest.spyOn(propertiesClient, 'send').mockReturnValueOnce(of(count));
    await expect(service.findAll(userId)).resolves.toEqual(translatedPlans);
    expect(usersClient.send).toHaveBeenCalledWith('users.findById', {
      id: userId,
    });
    expect(planRepository.find).toHaveBeenCalledWith(findPlan);
    expect(translateClient.send).toHaveBeenCalledWith(
      'translate.getTranslatedPlans',
      {
        plan: plans,
        language: user.language,
      },
    );
    expect(propertiesClient.send).toHaveBeenCalledWith(
      'properties.getProsCount',
      { userId },
    );
  });
});

import { CarbonUsageService } from '@app/application/carbon-usage/services/carbon-usage.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsageEntity } from '@app/domain';
import { Repository } from 'typeorm';
import { Instant } from '@js-joda/core';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  }),
);

describe('CarbonUsageService', () => {
  let service: CarbonUsageService;
  let repositoryMock: MockType<Repository<UsageEntity>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CarbonUsageService,
        {
          provide: getRepositoryToken(UsageEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(CarbonUsageService);
    repositoryMock = module.get(getRepositoryToken(UsageEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find usage by id for user', async () => {
    const now = Instant.now();
    const usage: UsageEntity = {
      id: 1,
      userId: 2,
      amount: 5,
      usageType: {
        id: 1,
        name: 'test',
        unit: 'test',
        usages: [],
        createdAt: now,
        updatedAt: now,
      },
      usageAt: now,
      createdAt: now,
      updatedAt: now,
    };

    repositoryMock.findOne?.mockReturnValue(usage);
    expect(await service.getCarbonUsage({ id: 1, userId: 2 })).toEqual({
      id: usage.id,
      userId: usage.userId,
      amount: usage.amount,
      usageAt: now,
      type: {
        id: usage.usageType!.id,
        name: usage.usageType!.name,
        unit: usage.usageType!.unit,
      },
    });
  });
});

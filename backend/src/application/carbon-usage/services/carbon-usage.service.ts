import { Injectable, NotFoundException } from '@nestjs/common';
import { Raw, Repository } from 'typeorm';
import { UsageEntity } from '@app/domain';
import {
  CarbonUsageDto,
  CarbonUsageFilterDto,
  CreateCarbonUsageDto,
  UpdateCarbonUsageDto,
} from '../dtos';
import { IPaginated } from '@app/shared/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from '@app/persistence/utils';

@Injectable()
export class CarbonUsageService {
  constructor(
    @InjectRepository(UsageEntity)
    private readonly usageRepository: Repository<UsageEntity>,
  ) {}

  async createCarbonUsage({
    userId,
    typeId,
    amount,
  }: CreateCarbonUsageDto & { userId: number }): Promise<CarbonUsageDto> {
    const usage = this.usageRepository.create({
      userId: userId,
      usageType: { id: typeId },
      amount,
    });

    await this.usageRepository.save(usage);
    return map(
      (await this.usageRepository.findOne({
        where: { id: usage.id },
        relations: ['usageType'],
      }))!,
    );
  }

  async updateCarbonUsage(
    id: number,
    { typeId, amount, userId }: UpdateCarbonUsageDto & { userId: number },
  ) {
    const updateResult = await this.usageRepository.update(
      { id, userId },
      {
        usageType: { id: typeId },
        amount,
      },
    );

    if (!updateResult.affected) {
      throw new NotFoundException(`Usage with id: ${id} not found.`);
    }
  }

  async getCarbonUsage({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<CarbonUsageDto> {
    const usage = await this.usageRepository.findOne({
      where: { id, userId },
      relations: ['usageType'],
    });

    if (!usage) {
      throw new NotFoundException(`Usage with id: ${id} not found.`);
    }

    return map(usage);
  }

  async removeCarbonUsage({ id, userId }: { id: number; userId: number }) {
    const res = await this.usageRepository.delete({
      id,
      userId,
    });

    if (!res.affected) {
      throw new NotFoundException(`Carbon usage with id: ${id} doesn't exist`);
    }
  }

  async getManyCarbonUsages({
    userId,
    from,
    to,
    sortField,
    sortDirection,
    ...pagingFilter
  }: CarbonUsageFilterDto & { userId: number }): Promise<
    IPaginated<CarbonUsageDto>
  > {
    let queryBuilder = this.usageRepository
      .createQueryBuilder('usage')
      .leftJoinAndSelect('usage.usageType', 'usageType')
      .where({ userId });

    if (from) {
      queryBuilder = queryBuilder.andWhere({
        createdAt: Raw((alias) => `${alias} >= :from`, {
          from: from,
        }),
      });
    }

    if (to) {
      queryBuilder = queryBuilder.andWhere({
        createdAt: Raw((alias) => `${alias} <= :to`, {
          to: to,
        }),
      });
    }

    if (sortField) {
      const direction = sortDirection || 'ASC';
      console.log(sortField);
      switch (sortField) {
        case 'amount':
          queryBuilder = queryBuilder.orderBy({
            [`usage.amount`]: direction,
          });
          break;
        case 'createdAt':
          queryBuilder = queryBuilder.orderBy({
            [`usage.createdAt`]: direction,
          });
          break;
        case 'type':
          queryBuilder = queryBuilder.orderBy({
            [`usageType.name`]: direction,
          });
          break;
      }
    }

    const { items, pagingInfo } = await paginate(pagingFilter, queryBuilder);
    return {
      items: items.map(map),
      pagingInfo,
    };
  }
}

const SORT_FIELDS = ['createdAt', 'amount', 'type'] as const;
type SortFieldType = typeof SORT_FIELDS;

function parseSort(
  sort?: string,
): { field: SortFieldType; direction: SortDirection } | null {
  if (!sort || sort === '') return null;

  const parts = sort.split('|');
  const field = parts?.[0] as any;
  if (SORT_FIELDS.indexOf(field) !== -1) {
    const direction = (parts?.[1] || 'DESC').toUpperCase() as SortDirection;
    return field && field !== '' ? { field, direction } : null;
  }

  return null;
}

type SortDirection = 'ASC' | 'DESC';

function map(entity: UsageEntity): CarbonUsageDto {
  return {
    id: entity.id,
    userId: entity.userId,
    amount: entity.amount,
    type: {
      id: entity.usageType!.id,
      name: entity.usageType!.name,
      unit: entity.usageType!.unit,
    },
  };
}

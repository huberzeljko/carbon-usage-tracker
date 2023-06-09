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
    usageAt,
  }: CreateCarbonUsageDto & { userId: number }): Promise<CarbonUsageDto> {
    const usage = this.usageRepository.create({
      userId: userId,
      usageType: { id: typeId },
      amount,
      usageAt,
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
    {
      typeId,
      amount,
      userId,
      usageAt,
    }: UpdateCarbonUsageDto & { userId: number },
  ) {
    const updateResult = await this.usageRepository.update(
      { id, userId },
      {
        usageAt,
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
        usageAt: Raw((alias) => `${alias} >= :from`, {
          from: from,
        }),
      });
    }

    if (to) {
      queryBuilder = queryBuilder.andWhere({
        usageAt: Raw((alias) => `${alias} <= :to`, {
          to: to,
        }),
      });
    }

    if (sortField) {
      const direction = sortDirection || 'ASC';
      switch (sortField) {
        case 'amount':
          queryBuilder = queryBuilder.orderBy({
            [`usage.amount`]: direction,
          });
          break;
        case 'usageAt':
          queryBuilder = queryBuilder.orderBy({
            [`usage.usageAt`]: direction,
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
    usageAt: entity.usageAt,
  };
}

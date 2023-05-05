import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CarbonUsageTypeDto,
  CreateCarbonUsageTypeDto,
  UpdateCarbonUsageTypeDto,
} from '../dtos';
import { UsageTypeEntity } from '@app/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarbonUsageTypeService {
  constructor(
    @InjectRepository(UsageTypeEntity)
    private readonly usageTypeRepository: Repository<UsageTypeEntity>,
  ) {}

  async createCarbonUsageType(
    data: CreateCarbonUsageTypeDto,
  ): Promise<CarbonUsageTypeDto> {
    const usageType = await this.usageTypeRepository.save(
      this.usageTypeRepository.create(data),
    );

    return map(usageType);
  }

  async updateCarbonUsageType(
    id: number,
    { name, unit }: UpdateCarbonUsageTypeDto,
  ) {
    const updateResult = await this.usageTypeRepository.update(id, {
      name,
      unit,
    });

    if (!updateResult.affected) {
      throw new NotFoundException(`Usage type with id: ${id} not found.`);
    }
  }

  async getCarbonUsageType(id: number): Promise<CarbonUsageTypeDto> {
    const usageType = await this.usageTypeRepository.findOne({
      where: { id },
    });

    if (!usageType) {
      throw new NotFoundException(`Usage with id: ${id} not found.`);
    }

    return map(usageType);
  }

  async removeCarbonUsageType(id: number) {
    const res = await this.usageTypeRepository.delete(id);
    if (!res.affected) {
      throw new NotFoundException(`Resource with ${id} doesn't exist`);
    }
  }
}

function map(entity: UsageTypeEntity): CarbonUsageTypeDto {
  return {
    id: entity.id,
    name: entity.name,
    unit: entity.unit,
  };
}

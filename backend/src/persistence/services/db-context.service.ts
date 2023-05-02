import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsageEntity, UsageTypeEntity, UserEntity } from '@app/domain';

@Injectable()
export class DbContext {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UsageEntity)
    private readonly usageRepository: Repository<UsageEntity>,
    @InjectRepository(UsageTypeEntity)
    private readonly usageTypeRepository: Repository<UsageTypeEntity>,
  ) {}

  get users() {
    return this.userRepository;
  }

  get usages() {
    return this.usageRepository;
  }

  get usageTypes() {
    return this.usageTypeRepository;
  }
}

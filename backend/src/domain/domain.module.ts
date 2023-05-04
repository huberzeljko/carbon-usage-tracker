import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RefreshTokenEntity,
  UsageEntity,
  UsageTypeEntity,
  UserEntity,
} from '@app/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UsageEntity,
      UsageTypeEntity,
      RefreshTokenEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DomainModule {}

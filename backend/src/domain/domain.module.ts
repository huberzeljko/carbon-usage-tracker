import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageEntity, UsageTypeEntity, UserEntity } from '@app/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UsageEntity, UsageTypeEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DomainModule {}

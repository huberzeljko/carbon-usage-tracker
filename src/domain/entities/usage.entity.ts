import { BaseAuditEntity, BaseEntity } from './shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { UsageTypeEntity } from '@app/domain/entities/usage-type.entity';
import { JodaInstantColumn } from '@app/domain/columns';
import { Instant } from '@js-joda/core';

@Entity('usage')
export class UsageEntity extends BaseEntity(BaseAuditEntity()) {
  @Column()
  amount: number;

  @Column()
  userId: number;

  @JodaInstantColumn()
  usageAt: Instant;

  @ManyToOne(() => UserEntity, (user) => user.usages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ManyToOne(() => UsageTypeEntity, (usageType) => usageType.usages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usage_type_id' })
  usageType?: UsageTypeEntity;
}

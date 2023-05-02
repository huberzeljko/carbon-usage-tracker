import { BaseAuditEntity, BaseEntity } from './shared';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { UsageTypeEntity } from '@app/domain/entities/usage-type.entity';

@Entity('usage')
export class UsageEntity extends BaseEntity(BaseAuditEntity()) {
  @ManyToOne(() => UserEntity, (user) => user.usages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UsageTypeEntity, (usageType) => usageType.usages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usage_type_id' })
  usageType: UsageTypeEntity;
}

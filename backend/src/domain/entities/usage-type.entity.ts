import { BaseAuditEntity, BaseEntity } from './shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { UsageEntity } from '@app/domain/entities/usage.entity';

@Entity('usage_type')
export class UsageTypeEntity extends BaseEntity(BaseAuditEntity()) {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 10 })
  unit: string;

  @OneToMany(() => UsageEntity, (usage) => usage.user)
  usages: UsageEntity[];
}

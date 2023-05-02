import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseAuditEntity, BaseEntity } from './shared';
import { UsageEntity } from './usage.entity';

@Entity({ name: 'user' })
@Unique(['name'])
export class UserEntity extends BaseEntity(BaseAuditEntity()) {
  @Column()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToMany(() => UsageEntity, (usage) => usage.user)
  usages: UsageEntity[];
}

import { BaseAuditEntity, BaseEntity } from '@app/domain/entities/shared';
import { JodaInstantColumn } from '@app/domain/columns';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '@app/domain';
import { Instant } from '@js-joda/core';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity(BaseAuditEntity()) {
  @Column({ unique: true })
  token: string;

  @JodaInstantColumn()
  expires: Instant;

  @Column({ nullable: true })
  remoteIpAddress?: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}

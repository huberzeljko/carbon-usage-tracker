import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JodaInstantTransformer } from '../../transformers';
import { Instant } from '@js-joda/core';
import { Constructor } from '@app/shared';
import { EmptyClass } from './base.entity';

export function BaseAuditEntity<TBase extends Constructor>(
  Base: TBase = EmptyClass as TBase,
) {
  abstract class AuditBase extends Base {
    @CreateDateColumn({
      type: 'timestamptz',
      transformer: new JodaInstantTransformer(),
    })
    createdAt: Instant;

    @UpdateDateColumn({
      type: 'timestamptz',
      transformer: new JodaInstantTransformer(),
    })
    updatedAt: Instant;
  }
  return AuditBase;
}

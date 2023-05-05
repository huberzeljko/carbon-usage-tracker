import { PrimaryGeneratedColumn } from 'typeorm';
import { Constructor } from '@app/shared';

export function BaseEntity<TBase extends Constructor>(
  Base: TBase = EmptyClass as TBase,
) {
  abstract class EntityBase extends Base {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
  }

  return EntityBase;
}

export class EmptyClass {}

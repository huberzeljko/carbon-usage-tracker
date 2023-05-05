import { Column } from 'typeorm';
import { JodaInstantTransformer } from '../transformers';
import { ColumnOptions } from 'typeorm';

export function JodaInstantColumn(
  options?: Exclude<ColumnOptions, 'type' | 'transformer'>,
): PropertyDecorator {
  return Column({
    nullable: options?.nullable,
    type: 'timestamptz',
    transformer: new JodaInstantTransformer(),
  });
}

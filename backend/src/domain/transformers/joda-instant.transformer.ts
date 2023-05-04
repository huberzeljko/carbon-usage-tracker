import { ValueTransformer } from 'typeorm';
import { convert, Instant, nativeJs } from '@js-joda/core';

export class JodaInstantTransformer implements ValueTransformer {
  from(value?: Date): Instant | undefined {
    return value ? Instant.from(nativeJs(value)) : undefined;
  }

  to(value?: any): any {
    if (value instanceof Instant) {
      return value ? convert(value).toDate() : undefined;
    }

    return value;
  }
}

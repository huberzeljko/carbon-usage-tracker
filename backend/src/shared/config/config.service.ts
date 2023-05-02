import {
  ConfigService as BaseConfigService,
  Path,
  PathValue,
} from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Config } from './config.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: BaseConfigService) {}

  get<P extends Path<Config> = any, R = PathValue<Config, P>>(
    propertyPath: P,
  ): R {
    return this.configService.get(propertyPath, { infer: true })!;
  }
}

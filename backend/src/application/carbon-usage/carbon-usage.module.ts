import { Module } from '@nestjs/common';
import {
  CarbonUsageService,
  CarbonUsageTypeService,
} from '@app/application/carbon-usage/services';
import { DomainModule } from '@app/domain';

const EXPORT_PROVIDERS = [CarbonUsageService, CarbonUsageTypeService];

@Module({
  imports: [DomainModule],
  providers: [...EXPORT_PROVIDERS],
  exports: [...EXPORT_PROVIDERS],
})
export class CarbonUsageModule {}

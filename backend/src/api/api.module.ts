import { Module } from '@nestjs/common';
import {
  AccountController,
  CarbonUsageController,
  CarbonUsageTypeController,
} from './controllers';
import { AccountModule } from '@app/application/account';
import { CarbonUsageModule } from '@app/application/carbon-usage';

@Module({
  imports: [AccountModule, CarbonUsageModule],
  controllers: [
    AccountController,
    CarbonUsageController,
    CarbonUsageTypeController,
  ],
})
export class ApiModule {}

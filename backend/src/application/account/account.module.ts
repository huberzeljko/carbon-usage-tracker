import { Module } from '@nestjs/common';
import { AccountService, JwtService } from './services';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards';
import { SharedModule } from '@app/shared';
import { PersistenceModule } from '@app/persistence';
import { DomainModule } from '@app/domain';

const EXPORT_PROVIDERS = [JwtService, AccountService];

@Module({
  imports: [SharedModule, PersistenceModule, DomainModule],
  providers: [
    ...EXPORT_PROVIDERS,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [...EXPORT_PROVIDERS],
})
export class AccountModule {}

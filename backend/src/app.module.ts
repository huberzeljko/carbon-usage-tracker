import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { DomainModule } from '@app/domain';
import { PersistenceModule } from '@app/persistence';
import { ApiModule } from '@app/api';

@Module({
  imports: [SharedModule, DomainModule, PersistenceModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

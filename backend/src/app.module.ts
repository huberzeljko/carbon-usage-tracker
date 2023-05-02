import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { DomainModule } from '@app/domain';
import { PersistenceModule } from '@app/persistence';

@Module({
  imports: [SharedModule, DomainModule, PersistenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

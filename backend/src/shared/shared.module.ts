import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { PasswordService } from '@app/shared/services';

const EXPORT_PROVIDERS = [PasswordService];

@Module({
  imports: [ConfigModule],
  providers: [...EXPORT_PROVIDERS],
  exports: [ConfigModule, ...EXPORT_PROVIDERS],
})
export class SharedModule {}

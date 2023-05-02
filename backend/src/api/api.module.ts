import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import { AccountModule } from '@app/application/account';

@Module({
  imports: [AccountModule],
  controllers: [AccountController],
})
export class ApiModule {}

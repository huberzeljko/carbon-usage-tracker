import { Module } from '@nestjs/common';
import { ConfigModule } from './config';

@Module({
  imports: [ConfigModule],
  exports: [ConfigModule],
})
export class SharedModule {}

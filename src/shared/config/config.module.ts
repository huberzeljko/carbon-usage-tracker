import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { configFactory } from './config.factory';
import { ConfigService } from './config.service';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [configFactory],
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

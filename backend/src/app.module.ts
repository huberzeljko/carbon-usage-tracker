import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

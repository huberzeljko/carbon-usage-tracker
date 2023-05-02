import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbContext } from './services/';
import { SharedModule } from '@app/shared';
import { ConfigService } from '@app/shared/config';
import { DomainModule } from '@app/domain';
import { UserSeedService } from './seeds';

const EXPORT_PROVIDERS = [DbContext];

@Module({
  imports: [
    DomainModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.databaseName,
          //migrationsRun: true,
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...EXPORT_PROVIDERS, UserSeedService],
  exports: [...EXPORT_PROVIDERS],
})
export class PersistenceModule {}

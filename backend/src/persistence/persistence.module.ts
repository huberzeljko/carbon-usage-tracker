import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/shared';
import { ConfigService } from '@app/shared/config';
import { DomainModule } from '@app/domain';
import { UserSeedService } from './seeds';
import { SnakeCaseNamingStrategy } from '@app/persistence/utils';

@Module({
  imports: [
    DomainModule,
    SharedModule,
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
          namingStrategy: new SnakeCaseNamingStrategy(),
          logging: 'all',
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UserSeedService],
  exports: [],
})
export class PersistenceModule {}

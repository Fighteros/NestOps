import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './strategies/snake-naming.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        ssl: configService.get<any>('database.ssl'),
        entities: configService.get<string[]>('database.entities'),
        autoLoadEntities: true,
        migrations: configService.get<string[]>('database.migrations'),
        subscribers: configService.get<string[]>('database.subscribers'),
        namingStrategy: new SnakeNamingStrategy(),
        extra: {
          connectionLimit: 10,
          aquireTimeout: 60000,
          timeout: 60000,
          // query optimization
          maxQueryExecutionTime: 10000,
        },
        poolSize: 10,
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('Database connected successfully');
      this.logger.log(
        ` Connected to db ${this.configService.get('database.host')}:${this.configService.get('database.port')}/${this.configService.get('database.database')}`,
      );
    }
  }
}

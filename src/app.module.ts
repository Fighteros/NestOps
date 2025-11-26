import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, LoggerModule],
})
export class AppModule {}

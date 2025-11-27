import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig, { appValidationSchema } from './configs/app.config';
import databaseConfig, {
  databaseValidationSchema,
} from './configs/database.config';
import secretsConfig, {
  secretsValidationSchema,
} from './configs/secrets.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig, databaseConfig, secretsConfig],
      validationSchema: appValidationSchema
        .concat(databaseValidationSchema)
        .concat(secretsValidationSchema),
    }),
  ],
})
export class ConfigModule {}

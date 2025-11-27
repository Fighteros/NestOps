import * as Joi from 'joi';

import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '8000', 10),
  cors: process.env.CORS_ORIGINS,
}));

export const appValidationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .required(),
  PORT: Joi.number().port().default(8000),
  CORS_ORIGINS: Joi.string().default('*'),
});

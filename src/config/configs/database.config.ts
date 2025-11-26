import * as Joi from 'joi';
import { join } from 'path';

export default () => ({
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: process.env.NODE_ENV === 'development' ? true : false,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    entities: [
      join(__dirname + '/modules/**/domain/entities/*.entity{.ts,.js}'),
      join(__dirname, 'common/entities/*.entity{.ts,.js}'),
    ],
    migrations: [
      __dirname + '/modules/**/domain/migrations/*.migration{.ts,.js}',
    ],
    subscribers: [
      __dirname + '/modules/**/domain/subscribers/*.subscriber{.ts,.js}',
    ],
  },
});

export const databaseValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_SSL: Joi.boolean().default(false),
  DATABASE_ENTITIES: Joi.array()
    .items(Joi.string())
    .default([__dirname + '/modules/**/domain/entities/*.entity{.ts,.js}']),
  DATABASE_MIGRATIONS: Joi.array()
    .items(Joi.string())
    .default([
      __dirname + '/modules/**/domain/migrations/*.migration{.ts,.js}',
    ]),
  DATABASE_SUBSCRIBERS: Joi.array()
    .items(Joi.string())
    .default([
      __dirname + '/modules/**/domain/subscribers/*.subscriber{.ts,.js}',
    ]),
});

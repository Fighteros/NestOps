import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

export default registerAs('secrets', () => ({
  uploadSecret: process.env.UPLOAD_SECRET,
}));

export const secretsValidationSchema = Joi.object({
  UPLOAD_SECRET: Joi.string().required(),
});

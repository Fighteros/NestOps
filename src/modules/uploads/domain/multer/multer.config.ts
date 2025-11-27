import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

export const MulterConfig = MulterModule.register({
  storage: multer.memoryStorage(),
});
